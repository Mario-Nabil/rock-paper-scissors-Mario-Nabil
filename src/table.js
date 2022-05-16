import { useState, useContext } from 'react'
import styled from 'styled-components'
import Token from './token'
import { WhiteButton } from './button'
import { ScoreContext } from './App'

const TableStyled = styled.div`
    display: grid;
    grid-template-columns:130px 130px;
    justify-content: center;
    justify-items: center;
    grid-gap: 30px 50px;
    margin: 2em 0;
    position: relative;
    & div:nth-of-type(3){
        grid-column: span 2;
    }
    .in-game {
        text-align: center;
        text-transform: uppercase;
        font-size: .8em;
        font-weight: 700;
        letter-spacing: 1px;
    }
    .results {
        text-align: center;
        h2 {
            text-transform: uppercase;
            font-size: 56px;
            margin: 10px;
        }
    }
    .line {
        display: ${({ Playing }) => !Playing ? 'block' : 'none'};
        height: 14px;
        background: rgba(0,0,0,.2);
        position: absolute;
        width: 200px;
        top: 58px;
        &:before {
            content:'';
            height: 14px;
            background: rgba(0,0,0,.2);
            position: absolute;
            left: 0px;
            right: 0px;
            top: 0px;
            transform: rotate(60deg);
            transform-origin: left top;
        }
        &:after {
            content:'';
            height: 14px;
            background: rgba(0,0,0,.2);
            position: absolute;
            left: 0px;
            right: 0px;
            top: 0px;
            transform: rotate(-60deg);
            transform-origin: right top;
        }
    }
    @media screen and (min-width: 1024px){
        // grid-gap: 30px 140px;
        grid-template-columns: 300px 300px;
        ${({ Playing, Result }) => (Playing && Result) && 'grid-template-columns: 300px 110px 110px 300px;'}
        & div:nth-of-type(3) {
            ${({ Playing, Result }) => (Playing && Result) && 'grid-column: 2 / 4;grid-row: 1;'}            
        }
        .line {
            width: 300px;
        }
        .results {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }        
        .in-game {
            font-size: 1.2em;
            display:flex;
            flex-direction: column;
            > div {
                order: 2;
            }
            > p {
                order: 1;
                margin-bottom: 2em;
            }
        }
        
    }
`
const elements = [
    'paper',
    'scissors',
    'rock',
]

function Table() {
    const { Score, setScore } = useContext(ScoreContext)
    const [Result, setResult] = useState('')
    const [HousePick, setHousePick] = useState('default')
    const [Playing, setPlaying] = useState(false)
    const [Pick, setPick] = useState('')
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
    function launchHousePick() {
        return new Promise((resolve, reject) => {
            let pick
            const interval = setInterval(() => {
                pick = elements[getRandomInt(0, 3)]
                setHousePick(pick)
            }, 75)
            setTimeout(() => {
                clearInterval(interval)
                resolve(pick)
            }, 2000)
        })

        // return elements[getRandomInt(0, 3)]

    }
    async function onClick(name) {
        setPlaying(true)
        setPick(name)
        const house = await launchHousePick()
        const results = playWithIA(name, house)
        setResult(results)
        if (results === 'Win') {
            setScore(Score + 1)
        }
    }
    function playWithIA(Pick, housePick) {
        if (Pick === housePick) {
            return 'Tie'
        }
        if (Pick === 'paper') {

            if (housePick === 'scissors') {
                return 'Lose'
            }
            if (housePick === 'rock') {
                return 'Win'
            }
        }
        if (Pick === 'scissors') {
            if (housePick === 'paper') {
                return 'Win'
            }

            if (housePick === 'rock') {
                return 'Lose'
            }
        }
        if (Pick === 'rock') {
            if (housePick === 'paper') {
                return 'Lose'
            }
            if (housePick === 'scissors') {
                return 'Win'
            }
        }
    }
    function handleTryAgainClick() {
        setPlaying(false)
        setResult('')
    }
    return (
        <TableStyled Playing={Playing} Result={(Result !== '')}>
            <span className="line"></span>
            {
                !Playing ? (
                    <>
                        <Token
                            name='paper'
                            onClick={onClick}
                        />
                        <Token
                            name='scissors'
                            onClick={onClick}
                        />
                        <Token
                            name='rock'
                            onClick={onClick}
                        />
                    </>
                ) : (
                    <>
                        <div className="in-game">
                            <Token
                                Playing={Playing}
                                name={Pick}
                                isShadowAnimated={(Result === 'Win')}
                            />
                            <p>You Picked</p>
                        </div>
                        <div className="in-game">
                            <Token
                                Playing={Playing}
                                name={HousePick}
                                isShadowAnimated={(Result === 'Lose')}
                            />
                            <p>The House Picked</p>
                        </div>
                        <div className="results">
                            {
                                Result && (
                                    <>
                                        {
                                            (Result === 'Tie') ?
                                                <h2> {Result} Game</h2> :
                                                <h2> You {Result}</h2>
                                        }
                                        <WhiteButton onClick={handleTryAgainClick}>
                                            Try Again!
                                        </WhiteButton>
                                    </>
                                )
                            }

                        </div>
                    </>

                )
            }


        </TableStyled>
    )
}

export default Table