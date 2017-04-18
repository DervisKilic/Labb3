/**
 * Created by Dervis on 21/03/17.
 */
var d1 = new Date();
var day = ("0" + d1.getDate()).slice(-2);
var month = ("0" + (d1.getMonth() + 1)).slice(-2);
var year = d1.getFullYear();
var today = (month) + '' + (day);

if (JSON.parse(localStorage.getItem("savedList")) == null) {
    localStorage.setItem("savedList", JSON.stringify([]));
}
var personList = JSON.parse(localStorage.getItem("savedList"));

window.onload = function () {
    showList();
};

function checkAge(birthday) {
    var bday = birthday.slice(0, 8);
    if (today < bday.slice(4)) {
        return year - bday.slice(0, 4) - 1;
    }
    else {
        return year - bday.slice(0, 4);
    }
}

function checkIfAdult(birthday) {
    return checkAge(birthday) > 18;
}

function checkIfCorrectNumber(birthday) {
    var sum = 0;
    var one;
    var two;
    var number = birthday.replace("-", "");
    number = number.substring(2, 11);
    number = number + "0";
    for (var i = 1; i <= 9; i = i + 2) {
        two = number[i - 1] * 2;
        if (two > 9) {
            two = +String(two).charAt(0) + +String(two).charAt(1);
        }
        one = number[i] * 1;
        sum += one + two;
    }
    sum = 10 - (sum % 10);
    if (sum == 10) {
        sum = 0;
    }

    return sum == String(birthday).charAt(12);
}

function validate() {
    document.getElementById("error").innerText = "";
    var person = {};
    var inputName = document.getElementById("name").value;
    var inputCrime = document.getElementById("crime").value;
    var inputPenalty = document.getElementById("penalty").value;
    var inputBirthday = document.getElementById("perNumber").value;

    person.fullName = inputName;
    person.birthday = inputBirthday;
    person.age = checkAge(person.birthday);
    person.crime = inputCrime;
    person.penalty = inputPenalty;

    if (checkIfCorrectNumber(person.birthday)) {
        if (checkIfExists(person.birthday)) {
            document.getElementById("error").innerHTML = "Personnummeret finns redan.";
        } else if (!(checkIfAdult(person.birthday))) {
            document.getElementById("error").innerHTML = "Du är omyndig.";

        } else {
            personList.unshift(person);
            document.getElementById("error").innerText = inputBirthday + " tilllagt.";
            localStorage.setItem("savedList", JSON.stringify(personList));
        }
    } else {
        document.getElementById("error").innerText = "Personnummeret är ogiltligt " + inputBirthday;
    }
}

function showList() {
    personList = JSON.parse(localStorage.getItem("savedList"));
    var table = document.getElementById("personTable");

    for (var i = 0; i < personList.length; i++) {
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);

        var fullname = document.createTextNode(personList[i].fullName);
        cell1.appendChild(fullname);

        cell2.innerHTML = personList[i].age;
        cell3.innerHTML = personList[i].birthday;
        cell4.innerHTML = personList[i].crime;
        cell5.innerHTML = personList[i].penalty;
        cell6.innerHTML = "<input class='deletebtn' type='button' value='X' onclick='deleteRow(this)'/>";
    }
}

function deleteRow(cell) {
    var row = cell.parentNode.parentNode;
    var y = row.childNodes[2].innerHTML;
    personList = personList.filter(function (obj) {
        return obj.birthday !== y;
    });
    row.remove(cell);
    localStorage.setItem("savedList", JSON.stringify(personList));
}

function checkIfExists(birthday) {
    var personList = JSON.parse(localStorage.getItem("savedList"));
    for (var i in personList) {
        var y = personList[i].birthday;
        if (y == birthday) {
            return true;
        }
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function add() {
    var inputField = document.getElementById("input");
    inputField.style.display = 'block';

    var table = document.getElementById("personTable");
    table.style.display = 'none';
}

function home() {
    var inputField = document.getElementById("input");
    inputField.style.display = 'none';

    var table = document.getElementById("personTable");
    table.style.display = 'table';
    window.location.reload(false);
}