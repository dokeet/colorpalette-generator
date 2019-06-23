import React, { useState, useEffect, useRef } from "react";
import { ColorExtractor } from "react-color-extractor";

let IMAGE_ONE = "";

function ImageExtractor() {
	const canvas = useRef(null);
	const srcImg = useRef(null);
	const imgRef = useRef(null);
	const [imgLink, setImgLink] = useState(null);
	const inputImg = useRef(null);
	let [colors, setColors] = useState(null);
	const [loaded, setLoaded] = useState(false);
	const [circlesBool, setCirclesBool] = useState(false);
	const [rectBool, setRectBool] = useState(true);

	function handleImage(e) {
		e.preventDefault();
		if (e.target.value.length === 0) {
			return;
		}
		if (loaded) {
			const ctx = canvas.current.getContext("2d");
			ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
			let reader = new FileReader();
			reader.onload = function(event) {
				var img = new Image();
				img.onload = function() {
					canvas.current.width = img.width;
					canvas.current.height = img.height;
					ctx.drawImage(img, 0, 0);
				};
				IMAGE_ONE = event.target.result;

				img.src = event.target.result;
				setLoaded(true);

				// srcImg.current.src = event.target.result;
			};
			reader.onerror = function(e) {
				e.preventDefault();
				return;
			};
			reader.onloadend = function(e) {
				reader.readAsDataURL(e.target.files[0]);
				return;
			};
			setLoaded(false);
		}

		const ctx = canvas.current.getContext("2d");
		let reader = new FileReader();

		reader.onload = function(event) {
			var img = new Image();
			img.onload = function() {
				canvas.current.width = img.width;
				canvas.current.height = img.height;
				ctx.drawImage(img, 0, 0);
			};
			IMAGE_ONE = event.target.result;

			img.src = event.target.result;
			setLoaded(true);

			// srcImg.current.src = event.target.result;
		};
		reader.onerror = function(e) {
			e.preventDefault();
		};
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}
	}
	function changeBackground() {
		document.documentElement.style.setProperty("--bg1", colors[1]);
		document.documentElement.style.setProperty("--bg2", colors[2]);
	}
	function drawCircle(color, r, distance, height) {
		const ctx = canvas.current.getContext("2d");
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(distance, height, r, 0, Math.PI * 2, true);
		ctx.fill();
	}
	function drawRect() {
		const ctx = canvas.current.getContext("2d");
		let x = canvas.current.width - canvas.current.width / 7;
		let y = 0;
		let width = canvas.current.width / 7;
		let height = canvas.current.height / 6;
		colors.forEach(r => {
			ctx.fillStyle = r;
			ctx.fillRect(x, y, width, height);
			y += height;
		});
	}
	function drawCircles() {
		const ratio = canvas.current.width / 25;
		let distance = ratio / 0.5;
		colors.forEach(color => {
			drawCircle(color, ratio, distance, ratio * 1.2);
			distance += ratio * 2.2;
		});
	}
	useEffect(() => {
		if (!colors) {
			return;
		}
		if (rectBool) {
			drawRect();
		}
		if (circlesBool) {
			drawCircles();
		}
		changeBackground();

		imgRef.current.src = canvas.current.toDataURL("image/jpeg", "1");
		setImgLink(imgRef.current.src);
	}, [colors, rectBool, circlesBool]);

	return (
		<>
			<input
				type="file"
				name="image"
				onChange={handleImage}
				ref={inputImg}
				id="img"
				accept="image/png, image/jpeg"
				style={{
					zIndex: -1,
					width: " 0.1px",
					height: " 0.1px",
					opacity: 0,
					overflow: "hidden",
					position: "absolute"
				}}
			/>
			<label
				htmlFor="img"
				style={{
					border: "1px solid #fff",
					padding: "0.7rem",
					background: "linear-gradient(var(--bg1) 0%, var(--bg2) 50%",
					color: "#fff"
				}}
			>
				Choose image{" "}
			</label>
			<div
				style={{
					display: "inline-flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<span>
					<p style={{ fontSize: "14px", paddingLeft: "1rem", fontWeight: 600 }}>
						Draw
					</p>
				</span>
				<input
					type="checkbox"
					checked={rectBool}
					onChange={() => setRectBool(!rectBool)}
				/>{" "}
				&#9644;
				<input
					type="checkbox"
					checked={circlesBool}
					onChange={() => setCirclesBool(!circlesBool)}
				/>{" "}
				&#9679;
			</div>

			<br />

			{loaded ? (
				<ColorExtractor getColors={colors => setColors(colors)} maxColors={128}>
					<img
						ref={srcImg}
						src={IMAGE_ONE}
						alt=""
						style={{ display: "none" }}
					/>
				</ColorExtractor>
			) : (
				<div>
					<img src={IMAGE_ONE} />
				</div>
			)}
			<canvas ref={canvas} style={{ display: "none" }} />

			{loaded ? (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexFlow: "column",
						paddingTop: "1rem"
					}}
				>
					<a
						style={{ textDecoration: "none", color: "#fff", display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexFlow: "column" }}
						href={imgLink}
						download="PatternImage.jpg"
					>
						<button
							style={{
								border: "1px solid #fff",
								padding: "0.7rem",
								backgroundColor: "var(--bg5)",
								color: "#fff"
							}}
						>
							get image
						</button>
						</a>

						<img
							ref={imgRef}
							alt=""
							style={{ maxHeight: "auto", width: "80%", paddingTop: "1rem" }}
						/>
					<br />
				</div>
			) : null}
		</>
	);
}

export default ImageExtractor;
