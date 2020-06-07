import { Context } from 'https://deno.land/x/oak/mod.ts';
import db from '../config/db.ts';

const employees = db.collection('employees');

interface Employee {
  name: string;
  age: number;
  salary: number;
}

const getEmployees = async ({ response }: Context) => {
  const allEmployees: Employee[] = await employees.find();
  response.status = 200;
  response.body = allEmployees.length ? allEmployees : { msg: 'There are not any employees.' };
};

const addEmployee = async ({ request, response }: Context) => {
  const employee  = ((await request.body()).value);
  if (employee.age && employee.name && employee.salary) {
    await employees.insertOne(employee);
    response.status = 200;
    response.body = { employee, msg: 'Success' };
    return;
  }
  response.status = 400;
  response.body = { msg: 'Employee values not valid.' };
}

const updateEmployee = async ({ params, request, response }: 
  { params: { id: string }; response: any; request: any }) => {
  const { id } = params as { id: string};

  const employeeToUpdate = ((await request.body()).value);
  const employee = await employees.findOne({ _id: { "$oid": id } });
  if (employee) {
    const { matchedCount } = await employees.updateOne(
      { _id: { "$oid": id }}, { $set: employeeToUpdate });
    if (matchedCount) {
      response.status = 204;
      response.body = { msg: 'Employee updated successfully.' };
      return;
    }
    response.status = 400;
    response.body = { msg: 'Unable to update employee' };
    return;
  }
  response.status = 404;
  response.body = { msg: 'Employee could not be found' };
}

const getEmployeeById = async ({ params, response }:
  { params: { id: string }; response : any }) => {
  const { id } = params as { id: string };
  const employee = await employees.findOne({ _id: { "$oid": id }});
  if (employee) {
    response.status = 200;
    response.body = employee;
    return;
  }
  response.status = 404;
  response.body = { msg: 'Employee could not be found' };
}

const deleteEmployee = async ({ params, response }:
  { params: { id: string }; response : any } ) => {
    const { id } = params as { id: string };
    const employee = await employees.findOne({ _id: { "$oid": id }});

    if (employee) {
      await employees.deleteOne({_id: { "$oid": id } });
      response.status = 204;
      response.body = { msg: 'Employee deleted successfully.' };
      return;
    }
    response.status = 404;
    response.body = { msg: 'Employee could not be found' };
}

export { getEmployees, addEmployee, updateEmployee, getEmployeeById, deleteEmployee };
