let result_score = document.querySelector('#result-score')
let mistakes_cont = document.querySelector('.mistakes_cont')

let userScore = JSON.parse(localStorage.getItem('userResult')) || null

let all_questions = 11

if(userScore.trueAnswers >= all_questions) {
    result_score.innerHTML = `${userScore.trueAnswers}/${all_questions} Good job`
} else if (userScore.trueAnswers > 7) {
    result_score.innerHTML = `${userScore.trueAnswers}/${all_questions}  Нормас`
} else if (userScore.trueAnswers > 4) {
    result_score.innerHTML = `${userScore.trueAnswers}/${all_questions}  Братан в школе надо было учиться `
} else if (userScore.trueAnswers > 1) {
    result_score.innerHTML = `${userScore.trueAnswers}/${all_questions} Приглашаем в нашу команду на роль уборщика `
} else  {
    result_score.innerHTML = `${userScore.trueAnswers}/${all_questions} Ну ты конечно и дебил `
} 


const reloadResult = (arr) => {
    console.log(arr);
    mistakes_cont.innerHTML = ""

    for(let item of arr) {
        let div = document.createElement('div')
        let h3 = document.createElement('h3')
        let wrapper_answ = document.createElement('div')
        for(let option of item.options) {
            let span = document.createElement('span')

            if(option.isTrue === false) {
                span.classList.add('false')
            }
            span.innerHTML = option.option

            wrapper_answ.append(span)
        }
        div.classList.add('item')
        wrapper_answ.classList.add('wrapper-answ')

        div.setAttribute('data-aos', "zoom-in-up")

        h3.innerHTML = item.question.replace(/<@select@>/g, '')

        div.append(h3, wrapper_answ)
        mistakes_cont.append(div)
    }
}

console.log(userScore);

reloadResult(userScore.falseAnswersArr)