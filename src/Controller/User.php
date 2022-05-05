<?php

class User {

    public function create($body, $args) {
        $requestUser = json_decode($body, true);

        $validation = $this->validateUser($requestUser);

        if ($validation != "Validated") {
            return ['status' => 400, 'data' => json_encode(['error' => $validation])];
        }

        $usersJson = file_get_contents('json/usuarios.json');

        $users = json_decode($usersJson, true);

        foreach ($users as $user) {
            if ($user['nombreUsuario'] == $requestUser['nombreUsuario']) {
                return ['status' => 400, 'data' => json_encode(['error' => 'El nombre de usuario ya existe'])];
            }
        }

        $requestUser['clave'] = md5($requestUser['clave']);
        unset($requestUser['claveRepetida']);

        $users[] = $requestUser;

        $userFile = fopen('json/usuarios.json', 'w+');
        fwrite($userFile,json_encode($users));
        fclose($userFile);

        return ['status' => 201, 'data' => json_encode(['nombre' => $requestUser['nombre'], 'nombreUsuario' => $requestUser['nombreUsuario']])];
    }

    private function validateUser($user) {
        //mismas validaciones q en el js

        $mayusculas = strtoupper('abcdfghijklmnñopqrstuvwxyz');
        $specialChars = '!?¿¡/()&¬%$·#+^[]{};.';

        if (!isset($user['nombre']) || $user['nombre'] == "") {
            return "El campo nombre es obligatorio";
        }

        if (!isset($user['nombreUsuario']) || $user['nombreUsuario'] == "") {
            return "El campo nombre de usuario es obligatorio";
        }

        if (!isset($user['clave']) || $user['clave'] == "") {
            return "El campo clave es obligatorio";
        }

        if (!isset($user['claveRepetida']) || $user['claveRepetida'] == "") {
            return "El campo de la clave repetida es obligatorio";
        }

        if($user['clave'] != $user['claveRepetida']) {
            return "Las claves introducidas deben ser iguales";
        }

        return "Validated";
    }

}

?>