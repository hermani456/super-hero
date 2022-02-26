// seleccion de elementos del dom
const form = document.querySelector("#form")
const heroInput = document.querySelector("#hero-input")
const heroInfo = document.querySelector("#hero-info")
const heroStats = document.querySelector("#hero-stats")

form.addEventListener("submit", (e) => {
	e.preventDefault()
	const valueInput = heroInput.value
	const patron = /^\d*[1-9]\d*$/
	if (!valueInput.match(patron)) {
		alert("Solo se permiten numero positivos como input")
	}fetch(
		"https://www.superheroapi.com/api.php/4905856019427443/" + valueInput
	).then((respuesta) => {
		respuesta.json().then((data) => {
			// asignando variables a los datos entregados por el json
			const name = data.name
			const image = data.image.url
			let connections = data.connections
			connections = Object.values(connections)[0]
			const publisher = data.biography.publisher
			const occupation = data.work.occupation
			const firstAppearance = data.biography["first-appearance"]
			const height = data.appearance.height
			const weight = data.appearance.weight
			const aliases = data.biography.aliases
			const powers = data.powerstats
			// if(connections === '-'){
			// 	connections = 'Unkown'
			// }
			

			// escribiendo resultados al dom
			heroInfo.innerHTML = `
			<div class="mb-3" id="card">
				<div class="row g-0">
					<div class="col-md-4" id="hero-img">
						<img src="${image}" class="img-fluid rounded-start">
					</div>
					<div class="col-md-8">
						<div class="card-body">
							<h5 class="card-title" id="hero-name"><span class="fw-bold">Name:</span> ${name}</h5>
							<p class="card-text" id="hero-connections"><span class="fw-bold">Connections:</span> ${connections}</p>
							<p class="card-text">
								<small class="text-muted" id="hero-publisher"><span class="fw-bold">Publisher: ${publisher}</span></small>
							</p>
							<p class="card-text" id="hero-occupation"><span class="fw-bold">Occupation:</span> ${occupation}</p>
							<p class="card-text" id="hero-first-appearance"><span class="fw-bold">First Appearance:</span> ${firstAppearance}</p>
							<p class="card-text" id="hero-height"><span class="fw-bold">Height:</span> ${height}</p>
							<p class="card-text" id="hero-weight"><span class="fw-bold">Weight:</span> ${weight}</p>
							<p class="card-text" id="hero-aliases"><span class="fw-bold">Aliases:</span> ${Object.values(aliases)}</p>
						</div>
					</div>
				</div>
		</div>`

			// canvasjs settings
			const config = {
				theme: "dark1",
				animationEnabled : true,
				backgroundColor: "transparent",
				title: {
					text: "Powers stats"
				},
				data: [{
						type: "pie",
						startAngle: 25,
						toolTipContent: "<b>{label}</b>: {y}%",
						showInLegend: "true",
						legendText: "{label}",
						indexLabelFontSize: 16,
						indexLabel: "{label} - {y}%",
						dataPoints: [
							{ y: powers.intelligence, label: "Intelligence" },
							{ y: powers.strength, label: "Strength" },
							{ y: powers.speed, label: "Speed" },
							{ y: powers.durability, label: "Durability" },
							{ y: powers.power, label: "Power" },
							{ y: powers.combat, label: "Combat" },
						]
					}]
			}
			if(powers.intelligence !== 'null'){
				const chart = new CanvasJS.Chart("hero-stats", config)
				chart.render()
			}else{
				alert('El heroe seleccionado no tiene datos para mostrar en el grafico')
				heroStats.innerHTML = `<div class="emoji text-center">🩹</div>`
			}
		})
	})
})
