const express = require('express');
const router = express.Router();

// Simple invite codes storage (in production, use a database)
const validInviteCodes = {
  'INVITE123': { status: 'active', keys: ['key1', 'key2'] },
  'INVITE456': { status: 'active', keys: ['key3', 'key4'] },
  'TESTCODE': { status: 'expired', keys: [] }
};

// POST /invite - Handle invite code validation
router.post('/invite', (req, res) => {
  const { inviteCode } = req.body;

  if (!inviteCode) {
    return res.status(400).json({ 
      error: 'Invite code is required' 
    });
  }

  const invite = validInviteCodes[inviteCode];

  if (!invite) {
    return res.status(404).json({ 
      error: 'Invalid invite code' 
    });
  }

  if (invite.status === 'expired') {
    return res.status(410).json({ 
      error: 'Invite code has expired' 
    });
  }

  return res.json({
    status: invite.status,
    keys: invite.keys,
    message: 'Invite code valid'
  });
});

// GET /invite/:code - Alternative endpoint to check invite code
router.get('/invite/:code', (req, res) => {
  const inviteCode = req.params.code;
  const invite = validInviteCodes[inviteCode];

  if (!invite) {
    return res.status(404).json({ 
      error: 'Invalid invite code' 
    });
  }

  return res.json({
    status: invite.status,
    keys: invite.status === 'active' ? invite.keys : [],
    message: invite.status === 'active' ? 'Invite code valid' : 'Invite code expired'
  });
});

module.exports = router;
