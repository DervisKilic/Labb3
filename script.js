/**
 * Created by Dervis on 21/03/17.
 */

var app = angular.module('labb3', ['ngRoute']);

var d1 = new Date();
var day = ("0" + d1.getDate()).slice(-2);
var month = ("0" + (d1.getMonth() + 1)).slice(-2);
var year = d1.getFullYear();
var today = (month) + '' + (day);

if (JSON.parse(localStorage.getItem("savedList")) == null) {
    localStorage.setItem("savedList", JSON.stringify([]));
}
var personList = JSON.parse(localStorage.getItem("savedList"));

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

app.config(function ($routeProvider) {
    $routeProvider

        .when('/list', {
            templateUrl : 'list.html',
            controller  : 'listController'
        })

        .when('/', {
            templateUrl : 'home.html',
            controller  : 'homeController'
        })

        .when('/home', {
            templateUrl : 'home.html',
            controller  : 'homeController'
        })

        .when('/add', {
            templateUrl : 'add.html',
            controller  : 'addController'
        })

        .when('/about', {
            templateUrl : 'about.html',
            controller  : 'aboutController'
        });
});


app.controller('listController', function ($scope) {
    showList();
});

app.controller('addController', function ($scope) {
    $scope.validate = function(){

        var person = {};
        var inputName = $scope.name;
        var inputCrime = $scope.crime;
        var inputPenalty = $scope.penalty;
        var inputBirthday = $scope.perNumber;

        person.fullName = inputName;
        person.birthday = inputBirthday;
        person.age = checkAge(person.birthday);
        person.crime = inputCrime;
        person.penalty = inputPenalty;

        $scope.error = "";
        if (checkIfCorrectNumber(person.birthday)) {
            if (checkIfExists(person.birthday)) {
                $scope.error = "Personnummeret finns redan.";
            } else if (!(checkIfAdult(person.birthday))) {
                $scope.error = "Du är omyndig.";

            } else {
                personList.unshift(person);
                $scope.error = inputBirthday + " tilllagt.";
                localStorage.setItem("savedList", JSON.stringify(personList));
            }
        } else {
            $scope.error = "Personnummeret är ogiltligt " + inputBirthday;
        }
    }
});