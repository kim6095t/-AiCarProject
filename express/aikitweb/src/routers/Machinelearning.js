import React, { useEffect} from "react";
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../css/Machinelearning.module.css'
import { Link } from "react-router-dom"
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import {mobNet} from "./Loading"


function Machinelearning() {
    const imageIp = "http://192.168.4.1/jpg"
    const net=mobNet
    const classifier = knnClassifier.create();
    const timer = ms => new Promise(res => setTimeout(res, ms))

    useEffect(() => {
        Imagelearn()
    }, []);


    const video=async()=>{
        while(true){
            loadImage()
            if (classifier.getNumClasses() > 0) {
                const img_output = document.getElementById('img-output');
                const activation = net.infer(img_output, 'conv_preds');
                const result = await classifier.predictClass(activation);
                const classes = ["전진", "왼쪽", "오른쪽","정지"];
                console.log(classes[result.classIndex])
                document.getElementById('answer').innerText = `
                    ${classes[result.classIndex]}\n
                `

                switch(result.classIndex){
                    case 0: toMove('w'); break;
                    case 1: toMove('a'); break;
                    case 2: toMove('d'); break;
                    default: toMove('s'); break;
                }
            }
            await timer(2000)
        }
    }

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

    const Imagelearn = async () => {
        const img_output = document.getElementById('img-output');

        const outputA = localStorage.getItem('A')
        const localDataA = JSON.parse(outputA)

        const outputB = localStorage.getItem('B')
        const localDataB = JSON.parse(outputB)

        const outputC = localStorage.getItem('C')
        const localDataC = JSON.parse(outputC)

        const outputD = localStorage.getItem('D')
        const localDataD = JSON.parse(outputD)

        for (let key in localDataA) {
            img_output.src = localDataA[key]
            await timer(100)
            addExample(0)
        }
        for (let key in localDataB) {
            img_output.src = localDataB[key]
            await timer(100)
            addExample(1)
        }
        for (let key in localDataC) {
            img_output.src = localDataC[key]
            await timer(100)
            addExample(2)
        }
        for (let key in localDataD) {
            img_output.src = localDataD[key]
            await timer(100)
            addExample(3)
        }
        video();
    }

    const addExample = (classId) => {
        const img_output = document.getElementById('img-output');
        const activation = net.infer(img_output, 'conv_preds');
        classifier.addExample(activation, classId);
    }

    const toMove=(direct)=>{
        fetch(`http://192.168.4.1/${direct}`)
            .then((response) => console.log("response:", response))
            .catch((error) => console.log("error:", error));
    }

    return (
        <div className={styles.container}>
            <img id="img-output" src={ImageData} className={styles.video} width="300" height="300" crossOrigin="anonymous" />
            <div className={styles.buttonList}>
                <Link to="/imageUpdate">
                <Button type="button" className={styles.home_button} variant="primary" onClick={()=>localStorage.clear()}>
                    <div>리셋</div>
                </Button>
                </Link>
            </div>
            <div id="answer" className={styles.answer}></div>
        </div>
    );
}

export default Machinelearning;
