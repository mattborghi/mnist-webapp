import React, { useEffect, useState } from "react";

import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import WritingCanvas from "./components/WritingCanvas";
import ModelPredict from "./components/ModelPredict";

const useStyles = makeStyles((theme) => ({
  item: {
    border: "1px solid red",
    height: "90vh",
    // padding: 20,
  },
  container: {
    padding: 20,
  },
  button: {
    // border: "1px solid red",
    // alignContent: "center",
    // height: "5vh",
    textAlign: "center",
    // padding: 20,
  },
  canvas: {
    width: "100%",
    height: "100%",
  },
}));

function App() {
  const classes = useStyles();
  const runModel = ModelPredict();
  const [image, setImage] = useState("");
  const [canvas, setCanvas] = useState();
  const [context, setContext] = useState();

  useEffect(() => {
    if (runModel) {
      // From https://www.html5canvastutorials.com/labs/html5-canvas-paint-application/
      var canvas: any = document.getElementById("myCanvas");
      setCanvas(canvas);
      var context = canvas.getContext("2d");
      console.log(typeof context);
      setContext(context);
      var paint: any = document.getElementById("paint");
      var compuetedStyle = getComputedStyle(paint);
      canvas.width = parseInt(compuetedStyle.getPropertyValue("width"));
      canvas.height = parseInt(compuetedStyle.getPropertyValue("height"));

      var mouse = { x: 0, y: 0 };

      var onPaint = function () {
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
      };

      canvas.addEventListener(
        "mousemove",
        function (e: any) {
          mouse.x = e.pageX - canvas.offsetLeft;
          mouse.y = e.pageY - canvas.offsetTop;
        },
        false
      );

      context.lineWidth = 25;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.strokeStyle = "#0000FF";

      canvas.addEventListener(
        "mousedown",
        function (e: any) {
          context.moveTo(mouse.x, mouse.y);
          context.beginPath();
          canvas.addEventListener("mousemove", onPaint, false);
        },
        false
      );

      canvas.addEventListener(
        "mouseup",
        function () {
          // $("#number").html('<img id="spinner" src="spinner.gif"/>');
          canvas.removeEventListener("mousemove", onPaint, false);
          var img = new Image();
          img.onload = function () {
            context.drawImage(img, 0, 0, 28, 28);
            var data = context.getImageData(0, 0, 28, 28).data;
            var input = [];
            for (var i = 0; i < data.length; i += 4) {
              input.push(data[i + 2] / 255);
              // console.log(data[i + 2] / 255);
            }
            runModel(input);
            // predict(input);
            // console.log(input);
          };
          img.src = canvas.toDataURL("image/png");
        },
        false
      );

      // runModel(image);
    }
  }, [image, runModel]);

  return (
    <Grid
      container
      className={classes.container}
      // spacing={4}
      direction="row"
      justify="space-around"
      alignItems="center"
    >
      <Grid className={classes.item} item xs={12} sm={5}>
        {/* <WritingCanvas setImage={setImage} /> */}
        <div id="paint" className={classes.canvas}>
          <canvas id="myCanvas"></canvas>
        </div>
      </Grid>
      <Grid item sm={2}></Grid>
      <Grid className={classes.item} item xs={12} sm={5}>
        None
      </Grid>
      <Grid className={classes.button} item xs>
        <Button
          variant="outlined"
          onClick={
            () => null
            // context && context.clearRect(0, 0, canvas.width, canvas.height)
          }
        >
          Clear
        </Button>
      </Grid>
    </Grid>
  );
}

export default App;
