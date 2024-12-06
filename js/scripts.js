const currency1 = document.querySelector("#currency1");
const currency2 = document.querySelector("#currency2");
const selects = document.querySelectorAll("select");
const ValueElement = document.querySelector("#value");
const btn = document.querySelector(".btn");
const resultContainer = document.querySelector(".result");
const valueResult = document.querySelector(".value");

let currencySelect1 = "";
let currencySelect2 = "";

const url = "https://economia.awesomeapi.com.br/";

const getCurrencys = async () => {
    btn.setAttribute("disabled", "");
    btn.innerText = "Carregando...";
    const response = await fetch(`${url}available/uniq`);

    const data = await response.json();
    btn.removeAttribute("disabled");
    btn.innerText = "Converter";
    return data;
};

const createOptions = (currencys, el) => {
    currencys.forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency[0];
        option.innerText = `${currency[0]} (${currency[1]})`;
        el.appendChild(option);
    });
};

const initialize = async () => {
    data = await getCurrencys();
    const currencys = [];

    for (var i in data) {
        currencys.push([i, data[i]]);
    }

    createOptions(currencys, currency1);
    createOptions(currencys, currency2);
};

const getQuote = async (currency1, currency2) => {
    currencyPair = `${currency1}-${currency2}`;
    key = `${currency1}${currency2}`;
    btn.setAttribute("disabled", "");
    btn.innerText = "Carregando...";
    const response = await fetch(`${url}json/last/${currencyPair}`);
    const data = await response.json();
    btn.removeAttribute("disabled");
    btn.innerText = "Converter";
    if (data.status === 404) return;
    return data[key].bid;
};

selects.forEach((select) => {
    select.addEventListener("change", (e) => {
        if (select.name == "currency1") {
            currencySelect1 = e.target.value;
        }

        if (select.name == "currency2") {
            currencySelect2 = e.target.value;
        }
    });
});

btn.addEventListener("click", async () => {
    valueConvert = ValueElement.value;

    if ((!currencySelect1 || !currencySelect2, !valueConvert)) {
        resultContainer.classList.add("hide");
        return;
    }

    if (currencySelect1 === currencySelect2) {
        resultContainer.classList.add("hide");
        return;
    }

    quote = await getQuote(currencySelect1, currencySelect2);

    if (!quote) {
        resultContainer.classList.add("hide");
        return;
    }

    const convert = valueConvert * quote;

    resultContainer.classList.remove("hide");
    valueResult.innerText = `${convert.toFixed(2)}`;
});

initialize();
