const baseURL = "http://localhost:8888"

const getQsts = async (which) => {
    const res = await fetch(baseURL + which)
    const data = res.json()

    return data
}

const setAnswer = async (which, body) => {
    const res = await fetch(baseURL + which, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    const data = res.json()

    return data
}

// end
let p = document.querySelector('p')
let goOnBtn = document.querySelector('.purple')
let radioCont = document.querySelector('.radio-container')

const createSelect = (options) => {
    let allOpts = '<option value="def"><option/>'
    for (let item of options) {
        let opt = `<option value="${item.id}">${item.option}<option/>`

        allOpts += opt
    }

    return allOpts
}


const showBtn = () => {
    setTimeout(() => {
        goOnBtn.classList.add('purple-active')
    }, 400);
}

const renderSelectQuestion = (question, user) => {
    radioCont.innerHTML = ""

    let replacedTxt = question.question.replace(/<@select@>/g, `<select>${createSelect(question.options)}<select/>`)

    p.innerHTML = `
        ${replacedTxt}:
    `



    let select = document.querySelector('select')

    select.onchange = () => {
        question.options.forEach(item => {
            if (+item.id === +select.value) {
                if (item.isTrue) {
                    select.style.color = "green"
                    select.setAttribute('disabled', true)
                    setAnswer('/userScore', {
                            trueAnswers: user.trueAnswers + 1,
                        })
                        .then(() => showBtn())
                } else {
                    select.setAttribute('disabled', true)
                    select.style.color = "red"
                    setAnswer('/userScore', {
                            falseAnswers: user.falseAnswers + 1,
                            falseAnswersArr: [...user.falseAnswersArr, question]
                        })
                        .then(() => showBtn())
                }
            }
        });
    }
}
const renderRadioQuestion = (question, user) => {
    p.innerHTML = question.question
    let trueID

    for (let item of question.options) {
        let div = document.createElement('div')
        let span = document.createElement('span')

        div.classList.add('radio')
        span.innerHTML = item.option
        div.setAttribute('id', item.id)

        div.append(span)
        radioCont.append(div)

        if (item.isTrue === true) trueID = question.options.indexOf(item)

        div.onclick = () => {
            if (item.isTrue) {
                div.classList.add('radio-active-valid')
                div.removeAttribute('onclick')
                setAnswer('/userScore', {
                        trueAnswers: user.trueAnswers + 1,
                    })
                    .then(() => showBtn())
            } else {
                div.classList.add('radio-active-invalid')
                console.log(question.options[trueID]);
                document.querySelectorAll('.radio')[trueID].classList.add('radio-active-valid')
                div.removeAttribute('onclick')
                setAnswer('/userScore', {
                        falseAnswers: user.falseAnswers + 1,
                        falseAnswersArr: [...user.falseAnswersArr, question]
                    })
                    .then(() => showBtn())
            }
        }
    }

}


Promise.all([getQsts('/select_questions'), getQsts('/radio_questions'), getQsts('/auido_questions'), getQsts('/userScore')])
    .then(res => {
        let counter = 0
        let selectCounter = 1
        let radioCounter = 0
        let audioCounter = 0

        let userScore = res[3]


        if (counter % 2 === 0) {
            let questionTypeOne = res[0][0]
            renderSelectQuestion(questionTypeOne, userScore)
        } else {
            let questionTypeTwo = res[1][0]
            renderRadioQuestion(questionTypeTwo, userScore)
        }

        goOnBtn.onclick = () => {
            counter++
            if (counter >= 6) {
                // audio
                let arr = res[2]
                const renderAudioQuestion = (question, user) => {
                    radioCont.innerHTML = ""
                    p.innerHTML = ""
                    let h1 = document.querySelector('h1')

                    let audio = document.createElement('audio')

                    h1.innerHTML = question.question
                    audio.src = `../audio${question.diolgue}`
                    audio.setAttribute("controls", "controls");

                    radioCont.before(audio)

                    for (let item of question.options) {
                        let div = document.createElement('div')
                        let span = document.createElement('span')

                        div.classList.add('radio')
                        span.innerHTML = item.option
                        div.setAttribute('id', item.id)

                        div.append(span)
                        radioCont.append(div)

                        if (item.isTrue === true) trueID = question.options.indexOf(item)

                        div.onclick = () => {
                            if (item.isTrue) {
                                div.classList.add('radio-active-valid')
                                div.removeAttribute('onclick')
                                setAnswer('/userScore', {
                                        trueAnswers: user.trueAnswers + 1,
                                    })
                                    .then(() => showBtn())
                                    audioCounter++
                            } else {
                                div.classList.add('radio-active-invalid')
                                console.log(question.options[trueID]);
                                document.querySelectorAll('.radio')[trueID].classList.add('radio-active-valid')
                                div.removeAttribute('onclick')
                                setAnswer('/userScore', {
                                        falseAnswers: user.falseAnswers + 1,
                                        falseAnswersArr: [...user.falseAnswersArr, question]
                                    })
                                    .then(() => showBtn())
                                    audioCounter++
                            }
                        }
                    }
                }
                renderAudioQuestion(arr[audioCounter], userScore)
            } else {
                if (counter % 2 === 0) {
                    let questionTypeOne = res[0][selectCounter]
                    renderSelectQuestion(questionTypeOne, userScore)
                    selectCounter++
                } else {
                    let questionTypeTwo = res[1][radioCounter]
                    renderRadioQuestion(questionTypeTwo, userScore)
                    radioCounter++
                }
            }
            goOnBtn.classList.remove('purple-active')
        }
    })