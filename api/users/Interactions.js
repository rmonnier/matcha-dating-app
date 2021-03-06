const MongoConnection = require('../MongoConnection');
const mail = require('./mail');
const Notifications = require('../notifications/Notifications');

const getInterest = async (req, res) => {
  const { target } = req.params;
  const { currentUser } = req.decoded;

  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: target, blocked: { $ne: currentUser } });
  if (!user) {
    return res.send({ error: 'User targeted doesn\'t exists' });
  }

  // check if currentUser likes target
  const alreadyLiked = user.interestedPeople.indexOf(currentUser) !== -1;
  return res.send({ error: '', alreadyLiked });
};

const updateInterest = users => async (req, res) => {
  const { currentUser } = req.decoded;
  const { target } = req.params;
  let { likes } = req.body;

  // parse value of likes field
  if (likes !== 'true' && likes !== 'false' && likes !== true && likes !== false) {
    return res.send({ error: 'Likes must be either true or false.' });
  }

  // convert likes into a boolean
  if (typeof likes === typeof '') {
    likes = likes === 'true';
  }

  // check if user try to like himself
  if (currentUser === target) {
    return res.send({ error: 'interest for himself impossible.' });
  }

  const usersCollection = MongoConnection.db.collection('users');
  // find the target in DB, can't find if blocked by the target
  let user = await usersCollection.findOne({ login: currentUser, blocked: { $ne: currentUser } });
  if (user.pictures.length === 0) {
    return res.send({ error: 'You must upload one picture before showing your interest to someone.' });
  }

  // find the target in DB, can't find if blocked by the target
  user = await usersCollection.findOne({ login: target, blocked: { $ne: currentUser } });
  if (!user) return res.send({ error: 'User targeted doesn\'t exists' });

  // check if target has been already liked
  const alreadyLiked = user.interestedPeople.indexOf(currentUser);

  // like action
  if (likes === true) {
    // already liked
    if (alreadyLiked !== -1) {
      const error = `${currentUser} already likes ${target}.`;
      return res.send({ error });
    }

    // check if target also likes currentUser
    const match = user.interestedIn.indexOf(currentUser);

    // update objects
    const currentUpdate = { $addToSet: { interestedIn: target } };
    const targetUpdate = {
      $addToSet: { interestedPeople: currentUser },
      $inc: { interestCounter: +1 },
    };

    // if match, modify update objects
    if (match !== -1) {
      currentUpdate.$addToSet.matches = target;
      targetUpdate.$addToSet.matches = currentUser;

      // send and update user notifications
      const newNotification = `${currentUser} has liked you back !`;
      Notifications.send(users, newNotification, user);
    } else {
      // send and update user notifications
      const newNotification = `${currentUser} now likes your profile.`;
      Notifications.send(users, newNotification, user);
    }
    usersCollection.updateOne({ login: currentUser }, currentUpdate);
    usersCollection.updateOne({ login: target }, targetUpdate);

    return res.send({ error: '' });
  }

  // unlike action
  // already not liked
  if (alreadyLiked === -1) {
    const error = `${currentUser} already doesn\t like ${target}.`;
    return res.send({ error });
  }

  // check if target also likes currentUser
  const match = user.interestedIn.indexOf(currentUser);

  // update objects
  const currentUpdate = { $pull: { interestedIn: target } };
  const targetUpdate = {
    $pull: { interestedPeople: currentUser },
    $inc: { interestCounter: -1 },
  };
  // if match, modify update objects
  if (match !== -1) {
    currentUpdate.$pull.matches = target;
    targetUpdate.$pull.matches = currentUser;
    const chatDeleteObj = {
      $or: [
        { to: currentUser, from: target },
        { to: target, from: currentUser },
      ],
    };
    const chatCollection = MongoConnection.db.collection('chat');
    chatCollection.deleteMany(chatDeleteObj, data => console.log(data));

    // send and update user notifications
    const newNotification = `The match with ${currentUser} is over.`;
    Notifications.send(users, newNotification, user);
  }
  usersCollection.updateOne({ login: currentUser }, currentUpdate);
  usersCollection.updateOne({ login: target }, targetUpdate);

  return res.send({ error: '' });
};

const getBlockStatus = async (req, res) => {
  const { currentUser } = req.decoded;
  const { target } = req.params;

  // find the target in DB, can't find if blocked by the target
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: target, blocked: { $ne: currentUser } });
  if (!user) return res.json({ error: 'User targeted doesn\'t exists' });

  let alreadyBlocked = user.blockedBy.indexOf(currentUser);

  alreadyBlocked = alreadyBlocked !== -1;
  return res.send({ error: '', alreadyBlocked });
};

const updateBlock = async (req, res) => {
  const { currentUser } = req.decoded;
  const { target } = req.params;
  let { blocks } = req.body;

  // parse value of blocks field
  if (blocks !== 'true' && blocks !== 'false' && blocks !== true && blocks !== false) {
    return res.send({ error: 'Blocks must be either true or false.' });
  }

  // convert blocks into a boolean
  if (typeof blocks === 'string') {
    blocks = blocks === 'true';
  }

  // check if user try to block himself
  if (currentUser === target) {
    return res.send({ error: 'Block himself impossible.' });
  }

  // find the target in DB, can't find if blocked by the target
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: target, blocked: { $ne: currentUser } });
  if (!user) return res.json({ error: 'User targeted doesn\'t exists' });

  const blocked = user.blockedBy.indexOf(currentUser);
  if (blocks === true) {
    if (blocked !== -1) {
      const error = `${currentUser} has already blocked ${target}.`;
      return res.send({ error });
    }
    usersCollection.updateOne({ login: currentUser }, { $addToSet: { blocked: target } });
    usersCollection.updateOne({ login: target }, { $addToSet: { blockedBy: currentUser } });
    return res.send({ error: '' });
  }
  if (blocked === -1) {
    const error = `${currentUser} is already not blocked by ${target}.`;
    return res.send({ error });
  }
  usersCollection.updateOne({ login: currentUser }, { $pull: { blocked: target } });
  usersCollection.updateOne({ login: target }, { $pull: { blockedBy: currentUser } });
  return res.send({ error: '' });
};

const reportUser = async (req, res, next) => {
  const { currentUser } = req.decoded;
  const { target } = req.params;

  if (currentUser === target) {
    return res.send({ error: 'Report himself impossible.' });
  }

  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: target, blocked: { $ne: currentUser } });
  if (!user) return res.json({ error: 'User targeted doesn\'t exists' });

  const email = 'api.matcha@laposte.net';
  const text = `The user ${target} has been reported as fake by ${currentUser}`;
  const subject = 'Matcha - New fake report';
  mail(email, subject, text);
  const reportsCollection = MongoConnection.db.collection('reports');
  reportsCollection.insertOne({ reporter: currentUser, reported: target });
  req.body.blocks = 'true';
  return next();
};

module.exports = { getInterest, updateInterest, updateBlock, reportUser, getBlockStatus };
