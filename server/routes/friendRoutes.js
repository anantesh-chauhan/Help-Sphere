const { Router } = require('express');
const auth = require("../middleware/auth");
const {
  searchUsers,
  sendRequest,
  getIncoming,
  getOutgoing,
  acceptRequest,
  rejectRequest,
  listFriends,
  unfriend,
  listUsers
} = require('../controllers/friendController.js');

const router = Router();
router.get('/users', auth, listUsers);
router.get('/search', auth, searchUsers);
router.post('/request', auth, sendRequest);
router.get('/incoming', auth, getIncoming);
router.get('/outgoing', auth, getOutgoing);
router.post('/accept/:requestId', auth, acceptRequest);
router.post('/reject/:requestId', auth, rejectRequest);
router.get('/', auth, listFriends);
router.delete('/:friendId', auth, unfriend);

module.exports = router;
