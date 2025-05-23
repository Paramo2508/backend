const mainScreenService = require('../services/mainScreenService');

/**
 * @description Obtener el nombre de usuario dado el id de usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve el nombre de usuario si se encuentra un usuario con el id dado
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_user = async (req, res) => {
  try{
    const user = req.params.id;
    const user_by_id = await mainScreenService.getUsernameById(user);
    if(user_by_id) {
      console.log("ID de usuario devuelto correctamente", user_by_id);
      res.status(200).json({ username: user_by_id });
    }
    else{
      console.log("Error1");
      res.status(404).json({message: "Ususario no encontrado"});
    }
  }
  catch(error) {
    console.log("Error2");
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Obtener el nombre de usuario dado el id de usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve el id de usuario si se encuentra un usuario con el username dado
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_id = async (req, res) => {
  try{
    const username = req.params.username;
    const user_id = await mainScreenService.getIdByUsername(username);
    if(user_id) {
      console.log("Username de usuario devuelto correctamente", user_id);
      res.status(200).json({ id: user_id });
    }
    else{
      console.log("Error1");
      res.status(404).json({message: "Ususario no encontrado"});
    }
  }
  catch(error) {
    console.log("Error2");
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Actualiza la fecha de última conexión del usuario dado un id de usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito si se actualiza la conexión y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const update_connection = async (req, res) => {
  try {
    const user_id = req.params.id;
    const to_update_user = mainScreenService.getUsernameById(user_id);
    
    //En caso de no encontrar el usuario
    if(!to_update_user) {
      res.status(404).json({message: "Usuario no encontrado"});
    }
    
    const result = await mainScreenService.updateConnection(user_id);
    res.status(200).json(result);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Obtiene todas las skins desbloqueadas por un usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito si se actualiza la conexión y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_unlocked_skins = async(req, res) => {
  try {
    const user_id = req.params.id;
    const user = mainScreenService.getUsernameById(user_id);
    
    if(!user) {
      res.status(404).json({message: "Usuario no encontrado"});
    }

    const result = mainScreenService.getUnlockedSkins(user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Actualiza los datos del usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito si se actualiza el usuario y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const update_user = async(req, res) => {
  try {
    const user_id = req.params.id;
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    const user = mainScreenService.getUsernameById(user_id);
    console.log(newPassword);
    
    if(!user) {
      res.status(404).json({message: "Usuario no encontrado"});
    }

    const result =  await mainScreenService.updateUser(user_id, newUsername, newPassword);
    console.log(result);
    if (result.message != "OK") {
      res.status(500).json({message: result.message});
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Verifica la contraseña del usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito si la contraseña es la correcta y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const verify_password = async(req, res) => {
  try {
    const user_id = req.params.id;
    const password = req.body.password;
    const user = mainScreenService.getUsernameById(user_id);
    
    if(!user) {
      res.status(404).json({message: "Usuario no encontrado"});
    }

    const result =  await mainScreenService.verifyPassword(user_id, password);
    console.log(result);
    if (result.message != "OK") {
      console.log(result.message);
      res.status(500).json({message: result.message});
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: error.message});
  }
}

module.exports = { get_user, get_id, update_connection, get_unlocked_skins, update_user, verify_password };