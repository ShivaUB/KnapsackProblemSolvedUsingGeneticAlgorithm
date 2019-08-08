var knapsack = document.getElementById('knapsack');
var btnAdd = document.getElementById('btnAdd');
var btn = document.getElementById('btn');
var order = [];
var inputs = [];
var index = 0;
var headerRow;
var firstRow;
var secondRow;
var population = [];

var bestValue = 0;
var bestMember;
var bestIndex;

btnAdd.addEventListener('click', () =>{
    const inp = new Input();
    inp.name = index;
    inp.value = document.getElementById('inputValue').value;
    inp.weight = document.getElementById('inputWeight').value;
    inputs.push(inp);
    order.push(index);
    if(index==0){
        headerRow = knapsack.insertRow(0);
        headerRow.style.color = "red";
        headerRow.style.fontSize = "40px";
        firstRow = knapsack.insertRow(1);
        secondRow = knapsack.insertRow(2);
        secondRow.style.color = "green";
    }
    headerRow.insertCell(index).innerHTML = "$" + inp.value + "<hr>" + inp.weight + "lbs";
    firstRow.insertCell(index).innerHTML = "";
    secondRow.insertCell(index).innerHTML = "";
    index++;
    document.getElementById('inputValue').focus();
    document.getElementById('inputValue').select();
})

class Input{
    constructor(name,val,weight){
        this.Name = name;
        this.value = val;
        this.weight = weight;
    }
}

class Member{
    constructor(inputMember,result){
        this.inputMember = inputMember;
        this.result = result;
    }

    calculateResult(){
        this.visualizeMember(1);
        if(this.calculateResultantWeight()<=document.getElementById('inputConstraintWeight').value){
            this.result = this.calculateResultantValue();
        }
    }

    calculateResultantWeight(){
        let resultantWeight = 0;
        this.inputMember.forEach((element,ind) => {
            if(element == 1){
                resultantWeight += Number(this.getInputByName(ind).weight);
            }
        });
        return Number(resultantWeight);
    }

    calculateResultantValue(){
        let resultantValue = 0;
        this.inputMember.forEach((element,ind) => {
            if(element == 1){
                resultantValue += Number(this.getInputByName(ind).value);
            }
        });
        return Number(resultantValue);
    }

    getInputByName(name){
        return inputs[name];
    }

    visualizeMember(rowIndex){
        setTimeout(() => {
            this.inputMember.forEach((element,ind) => {
                knapsack.rows[rowIndex].cells[ind].innerHTML = element;
            });
        }, 2000);
    }

    applyCrossOverAndMutate(memb){
        const crossoverLength = Math.floor(this.inputMember.length * crossOver);
        for(let i=0; i< crossoverLength; i++){
            this.inputMember[i] = memb[i];
        }
        this.inputMember.forEach((ele,indx) => {
            if (mutationRate > Math.random()) {
                var randomIndex = Math.floor(Math.random() * this.inputMember.length);
                this.inputMember[randomIndex] = (this.inputMember[randomIndex]==1)?0:1;
            }
        });
    }

    toString(){
        return "(" + this.inputMember.join() + ")";
    }
}

btn.addEventListener('click', () => {
    debugger;
    populationSize = document.getElementById('populationSize').value;
    crossOver = document.getElementById('crossOverRate').value;
    mutationRate = document.getElementById('mutationRate').value;
    generations= document.getElementById('NoOfGenerations').value;
    document.getElementById('inputArea').style.display = 'none';
    generatePopulation();
    for(let k=0;k<generations;k++){ 
        calculateResultForMembers();
        figureOutBestMember();
        crossOverAndMutation();
    }
})

function generatePopulation(){
    let member;
    for(let i=0;i<populationSize;i++){
        member = new Member(createMember(order.slice()),0);
        population.push(member);
    }
}

function createMember(arr){
    for(let i=0;i<arr.length;i++){
        arr[i] = Math.floor(Math.random()*2);
    }
    return arr;
}

function calculateResultForMembers(){
    population.forEach(element => {
        element.calculateResult();
    });
}

function figureOutBestMember(){
    debugger;
    population.forEach((ele,ind) => {
        if(ele.result > bestValue){
            bestMember = ele;
            bestValue = ele.result;
            bestIndex = ind;
            ele.visualizeMember(2);
            document.getElementById('statusLabel').innerHTML  += 'Best Value : ' + bestValue + "; Member : " + bestMember.toString() + '<br>';
        }
    });
}

function crossOverAndMutation(){
    population.forEach(element => {
        if(element != bestMember){
            element.applyCrossOverAndMutate(bestMember.inputMember.slice());
        }
    });
}