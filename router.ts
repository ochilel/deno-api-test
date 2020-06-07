import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getEmployees, addEmployee, updateEmployee, getEmployeeById, deleteEmployee } from './controllers/employee.ts';
import { login } from './controllers/user.ts';
import validateToken from './middlewares/auth.ts';

const router = new Router();

router.get('/employees', validateToken, getEmployees);
router.post('/employees', validateToken, addEmployee);
router.put('/employees/:id', validateToken, updateEmployee);
router.get('/employees/:id', validateToken, getEmployeeById);
router.delete('/employees/:id', validateToken, deleteEmployee);
router.post('/login', login);

export default router;
