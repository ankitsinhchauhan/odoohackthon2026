import Vehicle from "../models/Vehicle.js";

export const addVehicle = async (req, res) => {
  const vehicle = await Vehicle.create(req.body);
  res.json(vehicle);
};

export const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find();
  res.json(vehicles);
};
