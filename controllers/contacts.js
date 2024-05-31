import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, favorite = false } = req.query;
    const skip = (page - 1) * limit;

    const params = { owner: req.user.id };
    if (favorite) params.favorite = true;

    const data = await Contact.find(params, null, {
      skip,
      limit,
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);

    const contact = await Contact.findOne({ _id: id, owner: req.user.id });
    if (!contact) throw HttpError(404, "Contact not found");

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);

    const contact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });
    if (!contact) throw HttpError(404, "Contact not found");

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    console.log(req.user);

    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const newContact = await Contact.create({
      ...req.body,
      owner: req.user.id,
    });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    if (!req.body || Object.keys(req.body).length === 0)
      throw HttpError(400, "Body must have at least one field");

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedContact) throw HttpError(404, "Contact not found");
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);

    const { error } = updateStatusContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    if (!req.body || Object.keys(req.body).length === 0)
      throw HttpError(
        400,
        "Body must have an object with key 'favorite' and its value boolean"
      );

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      req.body,
      {
        new: true,
      }
    );

    if (!updatedContact) throw HttpError(404, "Contact not found");
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
