const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { setCache, getCache, deleteCache } = require('../utils/redisUtils');
const router = express.Router();

// Create a new task
router.post('/', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    await deleteCache(`tasks:${req.user._id}`);
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const cacheKey = `tasks:${req.user._id}`;
    const cachedTasks = await getCache(cacheKey);

    if (cachedTasks) {
      return res.send(JSON.parse(cachedTasks));
    }

    const tasks = await Task.find({ owner: req.user._id });
    await setCache(cacheKey, JSON.stringify(tasks));
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

// Get a specific task by id
router.get('/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const cacheKey = `task:${_id}`;
    const cachedTask = await getCache(cacheKey);

    if (cachedTask) {
      return res.send(JSON.parse(cachedTask));
    }

    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    await setCache(cacheKey, JSON.stringify(task));
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

// Update a task
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'completed'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();
    await deleteCache(`task:${req.params.id}`);
    await deleteCache(`tasks:${req.user._id}`);
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      res.status(404).send();
    }

    await deleteCache(`task:${req.params.id}`);
    await deleteCache(`tasks:${req.user._id}`);
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;