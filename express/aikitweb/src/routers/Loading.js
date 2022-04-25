import React, { useEffect, useState  } from "react";
import * as mobilenet from '@tensorflow-models/mobilenet';
import loadingPage from '../image/loadingPage.png'
import styles from '../css/Loading.module.css'
import { Link } from "react-router-dom"
import { Button } from 'react-bootstrap'

export let mobNet

function Loading() {
    const [mn, setmn]=useState(null)
    const [isgetDataInmobNet,SetDataInmobNet]=useState(false)

    useEffect(() => {
        if(mobNet==undefined)
            setmobNet()
        else
            SetDataInmobNet(true)
    },[]);

    useEffect(()=>{
        if(mn==null) return;
        mobNet=mn
        SetDataInmobNet(true)
    },[mn])

    const setmobNet=async()=>{
        setmn(await mobilenet.load())
    }

    return (
        <div className={styles.container}>
            <img className={styles.mainImage} src={loadingPage}/>
            <div>
                {isgetDataInmobNet==true?
                    <Link to="/moveCar"><Button className={styles.button}>운전하기</Button></Link>
                    :
                    <Button className={styles.button} disabled>운전하기</Button>
                }
            </div>
            <div>
                {isgetDataInmobNet==true?
                    <Link to="/imageUpdate"><Button className={styles.button}>인공지능시작</Button></Link>
                    :
                    <Button className={styles.button} disabled>인공지능시작</Button>
                }
            </div>
        </div>
    );
}

export default Loading;
