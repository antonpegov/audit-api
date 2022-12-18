import { CreateCustomerRequest } from '@projects/dto/create-customer.request'
import { Customer } from '@projects/schemas/customer.schema'

export const sanitizeCreateCustomerRequest = (
  _customer: CreateCustomerRequest,
): CreateCustomerRequest => {
  const customer = JSON.parse(JSON.stringify(_customer)) as Customer

  delete customer._id
  delete customer.createdAt
  delete customer.updatedAt

  return customer
}

