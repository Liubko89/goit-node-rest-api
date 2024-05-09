import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (_, res, next) => {
  try {
    const data = await contactsService.listContacts();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactsService.getContactById(id);
    if (!data) throw HttpError(404);

    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactsService.removeContact(id);
    if (!data) throw HttpError(404);

    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    if (!req.body || Object.keys(req.body).length === 0)
      throw HttpError(400, "Body must have at least one field");

    const updatedContact = await contactsService.updateContact(
      req.params.id,
      req.body
    );

    if (!updatedContact) throw HttpError(404);
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};
