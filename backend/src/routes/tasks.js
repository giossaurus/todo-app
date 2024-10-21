const express = require('express')
const Task = require('../models/Task')
const auth = require('../middleware/auth')
const { setCache, getCache, deleteCache} = require('../utils/redisUtils')
const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    console.log('Procurando tarefas do user:', req.user._id)
    const tasks = await Task.find({ owner: req.user._id })
    console.log('Tarefas recuperadas com sucesso')
    res.json(tasks)
  } catch (error) {
    console.error('Erro ao recuperar tarefas:', error)
    res.status(500).json({ error: 'Error ao carregar tarefas' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    console.log('Criando nova tarefa para o user:', req.user._id)
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    })
    await task.save();
    console.log('Tarefa criada com sucesso:', task._id)
    res.status(201).json(task)
  } catch (error) {
    console.error('Erro ao criar:', error)
    res.status(400).json({ error: error.message })
  }
})

router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'completed']
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Update inválido' })
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' })
    }

    updates.forEach((update) => (task[update] = req.body[update]))
    await task.save()
    await deleteCache(`task:${req.params.id}`)
    await deleteCache(`tasks:${req.user._id}`)
    res.json(task)
  } catch (error) {
    console.error('Erro atualizando tarefa:', error)
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' })
    }

    await deleteCache(`task:${req.params.id}`)
    await deleteCache(`tasks:${req.user._id}`)
    res.json({ message: 'Tarefa apagada com sucesso' })
  } catch (error) {
    console.error('Erro ao apagar:', error)
    res.status(500).json({ error: 'Erro apagando a tarefa' })
  }
})

module.exports = router