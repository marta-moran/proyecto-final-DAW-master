const minusculas = "abcdfghijklmnñopqrstuvwxyz";
const mayusculas = minusculas.toLocaleUpperCase();
const especiales = "!?¿¡/()&¬%$·#+^[]{};._-";
const numeros = "1234567890";

const app = Vue.createApp({
    data() {
        return {
            result: localStorage.getItem("nombre"),
            usuario: null,
            clave: null,
            error: null,
            usuarios: new Map(),
            newName: "",
            newUserName: "",
            newPass: "",
            repeatNewPass: "",
            nuevoUsuario: [],
            fecha: null,
            cats: new Map(),
        };
    },
    created() {
        fetch("../json/usuarios.json")
            .then(response => response.json())
            .then(response => this.usuarios = response)
        //puede que esto interfiera. REVISAR    
        fetch("../json/gatos.json")
            .then(respuesta => respuesta.json())
            .then(respuesta => this.cats = respuesta)
    },

    methods: {
        loginUsuario() {
            localStorage.clear();
            let existe = false;
            let hashClave = CryptoJS.MD5(this.clave);

            for (user of this.usuarios) {
                if (this.usuario == user.nombreUsuario && hashClave == user.clave) {
                    existe = true;
                    localStorage.setItem("nombre", user.nombre);

                    location.href = "principal.html";
                }
            }
            if (!existe) {
                this.error = "Usuario o contraseña incorrectos";
            }

        },
        registroUsuario() {
            location.href = "index-registro.html";
        },

        validarNuevoUsuario() {
            let especialesOk = true;
            let mayusculasOk = true;
            let userNameRepetido = false;

            for (user of this.usuarios) {
                if (this.newUserName == user.nombreUsuario) {
                    userNameRepetido = true
                }
            }

            for (let i = 0; i < especiales.length; i++) {
                for (let j = 0; j < mayusculas.length; j++) {
                    if (this.newUserName.includes(especiales.charAt(i))) {
                        especialesOk = false;
                    }
                    if (this.newUserName.includes(mayusculas.charAt(j))) {
                        mayusculasOk = false;
                    }
                }
            }

            if (!mayusculasOk || !especialesOk) {
                this.error = "El nombre de usuario no puede contener mayúsculas ni carcateres especiales";
            }

            if (userNameRepetido) {
                this.error = "El nombre de usuario ya existe"
            }

            if (especialesOk && mayusculasOk && !userNameRepetido) {
                return true;
            }

            
        },

        validarClaveNuevoUsuario() {
            let especialesOk = false;
            let mayusculasOk = false;
            let numeroOk = false;
            let clavesCoinciden = true;


            if (this.newPass != this.repeatNewPass) {
                this.error = "Las contraseñas no coinciden";
                clavesCoinciden = false;
            }

            for (let i = 0; i < mayusculas.length; i++) {
                for (let j = 0; j < especiales.length; j++) {
                    for (let k = 0; k < numeros.length; k++) {
                        if (this.newPass.includes(mayusculas.charAt(i))) {
                            mayusculasOk = true;
                        }
                        if (this.newPass.includes(especiales.charAt(j))) {
                            especialesOk = true;
                        }
                        if (this.newPass.includes(numeros.charAt(k))) {
                            numeroOk = true;
                        }
                    }
                }
            }

            if (!especialesOk || !mayusculasOk || !numeroOk) {
                this.error = "La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 1 caracter especial y 1 número."
            }

            if (this.newPass.length > 6 && mayusculasOk && especialesOk && numeroOk && clavesCoinciden) {
                return true;
            }
        },
        procesarUsuario() {
            this.validarNuevoUsuario();
            this.validarClaveNuevoUsuario();

            if (this.validarNuevoUsuario() && this.validarClaveNuevoUsuario()) {
                console.log("Usuario creado correctamente");
                this.nuevoUsuario = { "nombreUsuario": this.newUserName, "clave": this.newPass, "nombre": this.newName, "claveRepetida": this.repeatNewPass }
                this.usuarios.push(this.nuevoUsuario)
                location.href = "principal.html"
                localStorage.setItem("nombre", this.newName);


            } else if (this.newName == "" || this.newUserName == "" || this.newPass == "" || this.repeatNewPass == "") {
                this.error = "Por favor, rellena todos los campos"
          
            }

            if (this.error == null) {
                const data = this.nuevoUsuario;
                fetch('http://localhost/marta/proyecto-final-DAW-master/api.php?controller=user&action=create', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => function (response) {

                    if (!response.ok) {
                        console.log("error");
                    }
                })
                    .catch(error => console.error('Error:', error))
                    
            }
        },
        clickMenu() {
            let menu = document.getElementsByClassName("menu-bar")[0];
            let logo = document.getElementsByClassName("logo-menu-img")[0];

            if (menu.style.display == "" || menu.style.display == "none") {
                menu.style.display = "block";
                logo.style.transform = "rotate(90deg)";
            } else if (menu.style.display == "block") {
                menu.style.display = "none";
                logo.style.transform = "rotate(0deg)";
            }
        },
        logOut() {
            localStorage.clear();
            location.href = "index-login.html"
            console.log(localStorage);
        },
        
        addCat() {

        },
        gestionLocalStorage() {
            if (localStorage.length > 1) {
                localStorage.clear();
            }
        },
        listCats(punto) {
            for (cat of this.cats) {
                if (punto == cat.punto) {
                    const carrouselItem = document.createElement("div");
                    carrouselItem.setAttribute("class", "carousel-item")
                    const image = document.createElement("img");
                    image.setAttribute("class", "d-block w-100");
                    image.src = cat.img;

                    carrouselItem.appendChild(image)

                    const div = document.createElement("div");
                    const h2 = document.createElement("h2");
                    const p = document.createElement("p");
                    const p2 = document.createElement("p");
                    h2.innerHTML = cat.nombre;
                    p.innerHTML = "Color: " + cat.color;
                    p2.innerHTML = "Observaciones: <br>" + cat.observaciones;
                    if (cat.observaciones == "") {
                        p2.innerHTML += "—"
                    }

                    div.appendChild(h2);
                    div.appendChild(p);
                    div.appendChild(p2);
                    carrouselItem.appendChild(div);

                    for (let i = 0; i < document.getElementsByClassName("carousel-inner").length; i++) {
                        let item = document.getElementsByClassName("carousel-inner")[i].getAttributeNode("id").value;
                        if (item == cat.punto) {
                            console.log(item)
                            document.getElementById(item).appendChild(carrouselItem)
                        }
                    }
                }
            }
        }
    }
});


function crearMapa() {
    let map = L.map('map').setView([40.5474561, -3.6920009, 15.35], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([40.5463039, -3.6969561]).addTo(map);
    L.marker([40.5471316, -3.6946928]).addTo(map);
    L.marker([40.5464535, -3.6935156]).addTo(map);
    L.marker([40.547737, -3.6877735]).addTo(map);

}


function elTiempo() {
    const apiKey = "4da77490923ee60c91e798108330840c";

    let temperaturaValor = document.getElementById("temperatura-valor");
    let temperaturaDescripcion = document.getElementById('temperatura-descripcion')

    let ubicacion = document.getElementById('ubicacion')
    let iconoAnimado = document.getElementById('icono-animado')


    const url = `https://api.openweathermap.org/data/2.5/weather?q=Alcobendas&lang=es&units=metric&appid=${apiKey}`

    fetch(url)
        .then(response => data = response.json())
        .then(response => {
            console.log(response);
            temperaturaValor.innerHTML = Math.round(response.main.temp) + " °C"; //grados

            let desc = response.weather[0].description
            temperaturaDescripcion.innerHTML = desc; //descripcion

            ubicacion.innerHTML = response['name'];

            switch (response.weather[0].main) {
                case 'Thunderstorm':
                    iconoAnimado.src = '../animated/thunder.svg'
                    console.log('TORMENTA');
                    break;
                case 'Drizzle':
                    iconoAnimado.src = '../animated/rainy-2.svg'
                    console.log('LLOVIZNA');
                    break;
                case 'Rain':
                    iconoAnimado.src = '../animated/rainy-7.svg'
                    console.log('LLUVIA');
                    break;
                case 'Snow':
                    iconoAnimado.src = '../animated/snowy-6.svg'
                    console.log('NIEVE');
                    break;
                case 'Clear':
                    iconoAnimado.src = '../animated/day.svg'
                    console.log('LIMPIO');
                    break;
                case 'Atmosphere':
                    iconoAnimado.src = '../animated/weather.svg'
                    console.log('ATMOSFERA');
                    break;
                case 'Clouds':
                    iconoAnimado.src = '../animated/cloudy-day-1.svg'
                    console.log('NUBES');
                    break;
                default:
                    iconoAnimado.src = '../animated/cloudy-day-1.svg'
                    console.log('por defecto');
            }
        })
        .catch(console.error());
}

function crearCarru() {

    const arrayImgs = ["img1", "img2", "img3", "img4", "img5", "img6", "img7", "img8", "img9", "img10"];

    let divCarruselInner = document.getElementsByClassName("carousel-inner")[0];
    let divPadre = document.getElementsByClassName("carousel-item")[1];

    for (let i = 2; i < arrayImgs.length; i++) {
        let newItem = divPadre.cloneNode(true);
        divCarruselInner.appendChild(newItem);
        document.images[i].src = "../img/" + arrayImgs[i] + ".jpg";
    }
}
