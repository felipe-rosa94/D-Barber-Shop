import moment from "moment/moment";

const liberarTodos = [
    {
        "ativado": false,
        "dia": 0,
        "horarios": [
            {
                "id": 0,
                "hora": "09:00h",
                "reserva": true
            },
            {
                "id": 1,
                "hora": "09:35h",
                "reserva": true
            },
            {
                "id": 2,
                "hora": "10:10h",
                "reserva": true
            },
            {
                "id": 3,
                "hora": "10:45h",
                "reserva": true
            },
            {
                "id": 4,
                "hora": "11:20h",
                "reserva": true
            },
            {
                "id": 5,
                "hora": "13:00h",
                "reserva": true
            },
            {
                "id": 6,
                "hora": "13:35h",
                "reserva": true
            },
            {
                "id": 7,
                "hora": "14:10h",
                "reserva": true
            },
            {
                "id": 8,
                "hora": "14:45h",
                "reserva": true
            },
            {
                "id": 9,
                "hora": "15:20h",
                "reserva": true
            },
            {
                "id": 10,
                "hora": "15:55h",
                "reserva": true
            },
            {
                "id": 11,
                "hora": "16:30h",
                "reserva": true
            },
            {
                "id": 12,
                "hora": "17:05h",
                "reserva": true
            },
            {
                "id": 13,
                "hora": "17:40h",
                "reserva": true
            },
            {
                "id": 14,
                "hora": "18:15h",
                "reserva": true
            },
            {
                "id": 15,
                "hora": "18:50h",
                "reserva": true
            },
            {
                "id": 16,
                "hora": "19:25h",
                "reserva": true
            },
            {
                "id": 17,
                "hora": "20:00h",
                "reserva": true
            },
            {
                "id": 18,
                "hora": "20:35h",
                "reserva": true
            },
            {
                "id": 19,
                "hora": "00:00h",
                "reserva": true
            },
            {
                "id": 20,
                "hora": "00:00h",
                "reserva": true
            }
        ],
        "nome": "Domingo"
    },
    {
        "ativado": true,
        "dia": 1,
        "horarios": [
            {
                "id": 0,
                "hora": "09:00h",
                "reserva": false
            },
            {
                "id": 1,
                "hora": "09:35h",
                "reserva": false
            },
            {
                "id": 2,
                "hora": "10:10h",
                "reserva": false
            },
            {
                "id": 3,
                "hora": "10:45h",
                "reserva": false
            },
            {
                "id": 4,
                "hora": "11:20h",
                "reserva": false
            },
            {
                "id": 5,
                "hora": "13:00h",
                "reserva": true
            },
            {
                "id": 6,
                "hora": "13:35h",
                "reserva": true
            },
            {
                "id": 7,
                "hora": "14:10h",
                "reserva": false
            },
            {
                "id": 8,
                "hora": "14:45h",
                "reserva": false
            },
            {
                "id": 9,
                "hora": "15:20h",
                "reserva": false
            },
            {
                "id": 10,
                "hora": "15:55h",
                "reserva": false
            },
            {
                "id": 11,
                "hora": "16:30h",
                "reserva": false
            },
            {
                "id": 12,
                "hora": "17:05h",
                "reserva": false
            },
            {
                "id": 13,
                "hora": "17:40h",
                "reserva": false
            },
            {
                "id": 14,
                "hora": "18:15h",
                "reserva": false
            },
            {
                "id": 15,
                "hora": "18:50h",
                "reserva": false
            },
            {
                "id": 16,
                "hora": "19:25h",
                "reserva": false
            },
            {
                "id": 17,
                "hora": "20:00h",
                "reserva": false
            },
            {
                "id": 18,
                "hora": "20:35h",
                "reserva": false
            },
            {
                "id": 19,
                "hora": "21:10h",
                "reserva": false
            },
            {
                "id": 20,
                "hora": "00:00h",
                "reserva": true
            }
        ],
        "nome": "Segunda"
    },
    {
        "ativado": true,
        "dia": 2,
        "horarios": [
            {
                "id": 0,
                "hora": "09:00h",
                "reserva": false
            },
            {
                "id": 1,
                "hora": "09:35h",
                "reserva": false
            },
            {
                "id": 2,
                "hora": "10:10h",
                "reserva": false
            },
            {
                "id": 3,
                "hora": "10:45h",
                "reserva": false
            },
            {
                "id": 4,
                "hora": "11:20h",
                "reserva": false
            },
            {
                "id": 5,
                "hora": "13:00h",
                "reserva": true
            },
            {
                "id": 6,
                "hora": "13:35h",
                "reserva": true
            },
            {
                "id": 7,
                "hora": "14:10h",
                "reserva": false
            },
            {
                "id": 8,
                "hora": "14:45h",
                "reserva": false
            },
            {
                "id": 9,
                "hora": "15:20h",
                "reserva": false
            },
            {
                "id": 10,
                "hora": "15:55h",
                "reserva": false
            },
            {
                "id": 11,
                "hora": "16:30h",
                "reserva": false
            },
            {
                "id": 12,
                "hora": "17:05h",
                "reserva": false
            },
            {
                "id": 13,
                "hora": "17:40h",
                "reserva": false
            },
            {
                "id": 14,
                "hora": "18:15h",
                "reserva": false
            },
            {
                "id": 15,
                "hora": "18:50h",
                "reserva": false
            },
            {
                "id": 16,
                "hora": "19:25h",
                "reserva": false
            },
            {
                "id": 17,
                "hora": "20:00h",
                "reserva": false
            },
            {
                "id": 18,
                "hora": "20:35h",
                "reserva": false
            },
            {
                "id": 19,
                "hora": "21:10h",
                "reserva": false
            },
            {
                "id": 20,
                "hora": "00:00h",
                "reserva": true
            }
        ],
        "nome": "Terça"
    },
    {
        "ativado": true,
        "dia": 3,
        "horarios": [
            {
                "id": 0,
                "hora": "09:00h",
                "reserva": false
            },
            {
                "id": 1,
                "hora": "09:35h",
                "reserva": false
            },
            {
                "id": 2,
                "hora": "10:10h",
                "reserva": false
            },
            {
                "id": 3,
                "hora": "10:45h",
                "reserva": false
            },
            {
                "id": 4,
                "hora": "11:20h",
                "reserva": false
            },
            {
                "id": 5,
                "hora": "13:00h",
                "reserva": true
            },
            {
                "id": 6,
                "hora": "13:35h",
                "reserva": true
            },
            {
                "id": 7,
                "hora": "14:10h",
                "reserva": false
            },
            {
                "id": 8,
                "hora": "14:45h",
                "reserva": false
            },
            {
                "id": 9,
                "hora": "15:20h",
                "reserva": false
            },
            {
                "id": 10,
                "hora": "15:55h",
                "reserva": false
            },
            {
                "id": 11,
                "hora": "16:30h",
                "reserva": false
            },
            {
                "id": 12,
                "hora": "17:05h",
                "reserva": false
            },
            {
                "id": 13,
                "hora": "17:40h",
                "reserva": false
            },
            {
                "id": 14,
                "hora": "18:15h",
                "reserva": false
            },
            {
                "id": 15,
                "hora": "18:50h",
                "reserva": false
            },
            {
                "id": 16,
                "hora": "19:25h",
                "reserva": false
            },
            {
                "id": 17,
                "hora": "20:00h",
                "reserva": false
            },
            {
                "id": 18,
                "hora": "20:35h",
                "reserva": false
            },
            {
                "id": 19,
                "hora": "21:10h",
                "reserva": false
            },
            {
                "id": 20,
                "hora": "00:00h",
                "reserva": true
            }
        ],
        "nome": "Quarta"
    },
    {
        "ativado": true,
        "dia": 4,
        "horarios": [
            {
                "id": 0,
                "hora": "09:00h",
                "reserva": false
            },
            {
                "id": 1,
                "hora": "09:35h",
                "reserva": false
            },
            {
                "id": 2,
                "hora": "10:10h",
                "reserva": false
            },
            {
                "id": 3,
                "hora": "10:45h",
                "reserva": false
            },
            {
                "id": 4,
                "hora": "11:20h",
                "reserva": false
            },
            {
                "id": 5,
                "hora": "13:00h",
                "reserva": true
            },
            {
                "id": 6,
                "hora": "13:35h",
                "reserva": true
            },
            {
                "id": 7,
                "hora": "14:10h",
                "reserva": false
            },
            {
                "id": 8,
                "hora": "14:45h",
                "reserva": false
            },
            {
                "id": 9,
                "hora": "15:20h",
                "reserva": false
            },
            {
                "id": 10,
                "hora": "15:55h",
                "reserva": false
            },
            {
                "id": 11,
                "hora": "16:30h",
                "reserva": false
            },
            {
                "id": 12,
                "hora": "17:05h",
                "reserva": false
            },
            {
                "id": 13,
                "hora": "17:40h",
                "reserva": false
            },
            {
                "id": 14,
                "hora": "18:15h",
                "reserva": false
            },
            {
                "id": 15,
                "hora": "18:50h",
                "reserva": false
            },
            {
                "id": 16,
                "hora": "19:25h",
                "reserva": false
            },
            {
                "id": 17,
                "hora": "20:00h",
                "reserva": false
            },
            {
                "id": 18,
                "hora": "20:35h",
                "reserva": false
            },
            {
                "id": 19,
                "hora": "21:10h",
                "reserva": false
            },
            {
                "id": 20,
                "hora": "00:00h",
                "reserva": true
            }
        ],
        "nome": "Quinta"
    },
    {
        "ativado": true,
        "dia": 5,
        "horarios": [
            {
                "id": 0,
                "hora": "09:00h",
                "reserva": false
            },
            {
                "id": 1,
                "hora": "09:35h",
                "reserva": false
            },
            {
                "id": 2,
                "hora": "10:10h",
                "reserva": false
            },
            {
                "id": 3,
                "hora": "10:45h",
                "reserva": false
            },
            {
                "id": 4,
                "hora": "11:20h",
                "reserva": false
            },
            {
                "id": 5,
                "hora": "13:00h",
                "reserva": true
            },
            {
                "id": 6,
                "hora": "13:35h",
                "reserva": true
            },
            {
                "id": 7,
                "hora": "14:10h",
                "reserva": false
            },
            {
                "id": 8,
                "hora": "14:45h",
                "reserva": false
            },
            {
                "id": 9,
                "hora": "15:20h",
                "reserva": false
            },
            {
                "id": 10,
                "hora": "15:55h",
                "reserva": false
            },
            {
                "id": 11,
                "hora": "16:30h",
                "reserva": false
            },
            {
                "id": 12,
                "hora": "17:05h",
                "reserva": false
            },
            {
                "id": 13,
                "hora": "17:40h",
                "reserva": false
            },
            {
                "id": 14,
                "hora": "18:15h",
                "reserva": false
            },
            {
                "id": 15,
                "hora": "18:50h",
                "reserva": false
            },
            {
                "id": 16,
                "hora": "19:25h",
                "reserva": false
            },
            {
                "id": 17,
                "hora": "20:00h",
                "reserva": false
            },
            {
                "id": 18,
                "hora": "20:35h",
                "reserva": false
            },
            {
                "id": 19,
                "hora": "21:10h",
                "reserva": false
            },
            {
                "id": 20,
                "hora": "00:00h",
                "reserva": true
            }
        ],
        "nome": "Sexta"
    },
    {
        "ativado": true,
        "dia": 6,
        "horarios": [
            {
                "id": 0,
                "hora": "09:00h",
                "reserva": false
            },
            {
                "id": 1,
                "hora": "09:35h",
                "reserva": false
            },
            {
                "id": 2,
                "hora": "10:10h",
                "reserva": false
            },
            {
                "id": 3,
                "hora": "10:45h",
                "reserva": false
            },
            {
                "id": 4,
                "hora": "11:20h",
                "reserva": false
            },
            {
                "id": 5,
                "hora": "13:00h",
                "reserva": true
            },
            {
                "id": 6,
                "hora": "13:35h",
                "reserva": true
            },
            {
                "id": 7,
                "hora": "14:10h",
                "reserva": false
            },
            {
                "id": 8,
                "hora": "14:45h",
                "reserva": false
            },
            {
                "id": 9,
                "hora": "15:20h",
                "reserva": false
            },
            {
                "id": 10,
                "hora": "15:55h",
                "reserva": false
            },
            {
                "id": 11,
                "hora": "16:30h",
                "reserva": false
            },
            {
                "id": 12,
                "hora": "17:05h",
                "reserva": false
            },
            {
                "id": 13,
                "hora": "17:40h",
                "reserva": false
            },
            {
                "id": 14,
                "hora": "18:15h",
                "reserva": false
            },
            {
                "id": 15,
                "hora": "18:50h",
                "reserva": false
            },
            {
                "id": 16,
                "hora": "19:25h",
                "reserva": false
            },
            {
                "id": 17,
                "hora": "20:00h",
                "reserva": false
            },
            {
                "id": 18,
                "hora": "20:35h",
                "reserva": false
            },
            {
                "id": 19,
                "hora": "21:10h",
                "reserva": false
            },
            {
                "id": 20,
                "hora": "00:00h",
                "reserva": true
            }
        ],
        "nome": "Sábado"
    }
]

const isDebug = () => {
    try {
        return (window.location.host === 'localhost:3000')
    } catch (e) {

    }
}

const verificaHorarios = async (dia, id) => {
    return await fetch(isDebug()
            ? `https://barbearia-teste-5d937-default-rtdb.firebaseio.com/dias/${dia}/horarios/${id}.json`
            : `https://barbearia-3f560-default-rtdb.firebaseio.com/dias/${dia}/horarios/${id}.json`,
        {method: 'get'}).then((data) => data.json()).catch((error) => (error))
}

const timestamp = () => {
    const date = new Date()
    return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
}

const codigoDia = () => {
    return '00' + (parseInt(moment().format('MMYYYY')) * parseInt(moment().format('DD')) * 135).toString()
}

const mobile = () => {
    let check = false;
    ((a) => {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera)
    return check
}

export {liberarTodos, isDebug, verificaHorarios, timestamp, codigoDia, mobile}
