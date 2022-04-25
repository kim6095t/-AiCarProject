import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../css/ImageUpdate.module.css'

function ImageUpdate() {
    const imageIp = "http://192.168.4.1/jpg"
    const [countA, setCountA]=useState(0)
    const [countB, setCountB]=useState(0)
    const [countC, setCountC]=useState(0)
    const [countD, setCountD]=useState(0)


    useEffect(() => {
        const imgUpdate=setInterval(()=>{ loadImage()},500)
        return ()=>{
            clearInterval(imgUpdate)
        }
    }, []);


    const loadImage = () => {
        const img_output = document.getElementById('img-output');
        toDataURL(imageIp, function (dataUrl) {
            img_output.src = dataUrl
        })
        return img_output
    }
    const toDataURL=(url, callback)=> {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    const onSetFileClassifier = (clas) => {
        toDataURL(imageIp, function (dataUrl) {
            const output = localStorage.getItem(clas)
            const localData = JSON.parse(output)
            if (localData == null) {
                const userObj = [dataUrl]
                localStorage.setItem(clas, JSON.stringify(userObj))
            } else {
                const userObj = [...localData, dataUrl]
                localStorage.setItem(clas, JSON.stringify(userObj))
            }
            switch(clas){
                case('A'):
                    setCountA(JSON.parse(localStorage.getItem('A')).length)
                    break
                case('B'):
                    setCountB(JSON.parse(localStorage.getItem('B')).length)
                    break
                case('C'):
                    setCountC(JSON.parse(localStorage.getItem('C')).length)
                    break
                case('D'):
                    setCountD(JSON.parse(localStorage.getItem('D')).length)
                    break
            }
        })
    }

    return (
        <div className={styles.container}>
            <img id="img-output" className={styles.video} width="300" height="300" crossOrigin="anonymous" />
            <div>
                <Button type="button" className={styles.button} onClick={() => {onSetFileClassifier('A')}} variant="primary">{countA}</Button>
            </div>
            <div>
                <Button type="button" className={styles.button} onClick={() => {onSetFileClassifier('B')}} variant="primary">{countB}</Button>
                <Button type="button" className={styles.button} onClick={() => {onSetFileClassifier('C')}} variant="primary">{countC}</Button>
            </div>
            <div>
                <Button type="button" className={styles.button} onClick={() => {onSetFileClassifier('D')}} variant="primary">{countD}</Button>
            </div>
            <div className={styles.buttonList}>
                <div>
                    <Link to="/">
                        <Button type="button" className={styles.home_button} variant="primary">
                            <div>홈으로</div>
                        </Button>
                    </Link>
                </div>
                <div>
                    <Link to="/Machinelearning">
                        <Button type="button" className={styles.home_button} variant="primary">
                            학습하기
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ImageUpdate;
