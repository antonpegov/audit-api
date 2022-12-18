import { CustomerData } from '@projects/dto/customer.data'
import { Customer } from '@projects/schemas/customer.schema'

export const sanitizeCustomer = (_customer: Customer): CustomerData => {
  const customer = JSON.parse(JSON.stringify(_customer)) as Customer

  delete customer.userId
  delete customer.contacts['_id']

  return customer
}

