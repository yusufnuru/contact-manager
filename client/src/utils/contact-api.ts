/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Contact } from "../types";
import api from "./api";

const fetchContacts = async (params: any = {}) => {
  const response = await api.get('/contacts', { params });
  return response.data;
};

const createContact = async (contact: Omit<Contact, 'id' | 'created_at'>) => {
  const response = await api.post('/contacts', contact);
  return response.data;
};

const updateContact = async ({ id, ...contact }: Partial<Contact> & { id: string }) => {
  const response = await api.patch(`/contacts/${id}`, contact);
  return response.data;
};

const deleteContact = async (id: string) => {
  await api.delete(`/contacts/${id}`);
};

export { fetchContacts, createContact, updateContact, deleteContact };