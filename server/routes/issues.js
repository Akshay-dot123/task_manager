const express = require('express');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// Dashboard Counts
router.get('/dashboard', async (req, res) => {
  const open = await Issue.countDocuments({ status: 'Open' });
  const inProgress = await Issue.countDocuments({ status: 'In Progress' });
  const closed = await Issue.countDocuments({ status: 'Closed' });
  res.json({ open, inProgress, closed });
});

// Get All Issues
router.get('/', async (req, res) => {
  const issues = await Issue.find().populate('reporter assignee', 'name email')
  .populate('comments.user', 'name');
  res.json(issues);
});

// Create Issue
router.post('/', async (req, res) => {
  const { title, description, assignee } = req.body;
  const issue = await Issue.create({ title, description, reporter: req.user._id, assignee });
  res.status(201).json(issue);
});

// Update Issue (Edit, Assign, Status)
router.put('/:id', async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Not found' });

  issue.title = req.body.title || issue.title;
  issue.description = req.body.description || issue.description;
  issue.status = req.body.status || issue.status;
  issue.assignee = req.body.assignee || issue.assignee;

  const updated = await issue.save();
  
  // Re-populate the assignee and reporter before sending response
  const populatedIssue = await Issue.findById(updated._id)
    .populate('reporter', 'name email')
    .populate('assignee', 'name email')
    .populate('comments.user', 'name');
    
  res.json(populatedIssue);
});

// Delete Issue
router.delete('/:id', async (req, res) => {
  await Issue.findByIdAndDelete(req.params.id);
  res.json({ message: 'Removed' });
});

// Add Comment
router.post('/:id/comments', async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  issue.comments.push({ user: req.user._id, text: req.body.text });
  await issue.save();
  res.status(201).json(issue);
});

// Get Users (for assignment dropdown)
router.get('/users', async (req, res) => {
  const users = await User.find().select('name email');
  res.json(users);
});

module.exports = router;