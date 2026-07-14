import Resource from '../models/Resource.js';

export async function list(req, res) {
  const resources = await Resource.find({ isActive: true });
  res.status(200).json(resources);
}

export async function create(req, res) {
  const resource = await Resource.create(req.body);
  res.status(201).json(resource);
}