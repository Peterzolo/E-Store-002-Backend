import { findOrderById } from '../order/order.dao.js';
import { findAllUsers, findUserById } from './user.dao.js';
import { createUser, signIn } from './user.service.js';

export const register = async (req, res) => {
  const body = req.body;
  try {
    const userObject = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      isAdmin: body.isAdmin,
      status: body.status,
    };
    const user = await createUser(userObject);
    res.status(200).json({
      Success: true,
      Message: 'User successfully registered',
      data: user,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await signIn(email, password);
    res.status(200).json({
      Success: true,
      message: 'User successfully logged in',
      data: user,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};


export const fetchAllUsers = async(req, res) =>{


  const users = await findAllUsers ();
  console.log('USERS',users)

  if(users.length < 1){
    res.status(402).send({message : "Users not found"})
  }else {
    res.status(201).send({
      success : true,
      message : "User successfully fetched",
      result : users
    })
  }
}
export const fetchUserDetails = async(req, res) =>{
  const id = req.params.id;

  const findUser = await findUserById(id);
  console.log('FIND USER',findUser)

  if(!findUser){
    res.status(402).send({message : "User not found"})
  }else {
    res.status(201).send({
      success : true,
      message : "User successfully fetched",
      result : findUser
    })
  }
}