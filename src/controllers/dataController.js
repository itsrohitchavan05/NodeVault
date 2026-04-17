const { validationResult } = require('express-validator');
const supabase = require('../db/supabase');

async function getAllData(req, res) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('id, content, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error('Get data error:', err);
    return res.status(500).json({ error: 'Failed to retrieve data.' });
  }
}

async function createData(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content } = req.body;

  try {
    const { data, error } = await supabase
      .from('user_data')
      .insert({ user_id: req.user.id, content })
      .select('id, content, created_at')
      .single();

    if (error) throw error;

    return res.status(201).json({ message: 'Entry created.', data });
  } catch (err) {
    console.error('Create data error:', err);
    return res.status(500).json({ error: 'Failed to create entry.' });
  }
}

async function deleteData(req, res) {
  const { id } = req.params;

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('user_data')
      .select('id, user_id')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!existing) {
      return res.status(404).json({ error: 'Entry not found.' });
    }

    if (existing.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this entry.' });
    }

    const { error } = await supabase.from('user_data').delete().eq('id', id);
    if (error) throw error;

    return res.json({ message: 'Entry deleted successfully.' });
  } catch (err) {
    console.error('Delete data error:', err);
    return res.status(500).json({ error: 'Failed to delete entry.' });
  }
}

module.exports = { getAllData, createData, deleteData };
