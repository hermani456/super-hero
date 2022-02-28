// seleccion de elementos del dom
const form = document.querySelector("#form")
const heroInput = document.querySelector("#hero-input")
const heroInfo = document.querySelector("#hero-info")
const heroStats = document.querySelector("#hero-stats")

form.addEventListener("submit", (e) => {
	e.preventDefault()
	const valueInput = heroInput.value
	// regex que chequea solo numeros positivos
	const patron = /^\d*[1-9]\d*$/
	if (!valueInput.match(patron) || valueInput > 732) {
		alert("Solo se permiten numeros del rango: ( 1 - 732 )")
		return
	}
	fetch(
		"https://www.superheroapi.com/api.php/4905856019427443/" + valueInput
	).then((respuesta) => {
		respuesta.json().then((data) => {
			// asignando variables a los datos entregados por el json
			const name = data.name
			const image = data.image.url
			let connections = data.connections["group-affiliation"]
			let publisher = data.biography.publisher
			let occupation = data.work.occupation
			let firstAppearance = data.biography["first-appearance"]
			let height = data.appearance.height
			let weight = data.appearance.weight
			let aliases = data.biography.aliases
			aliases = Object.values(aliases)
			const powers = data.powerstats

			// llena con unkown los datos que no arrojen resultado (-)
			if (connections === "-") {
				connections = "Unkown"
			}
			if (publisher === "-") {
				publisher = "Unkown"
			}
			if (occupation === "-") {
				occupation = "Unkown"
			}
			if (firstAppearance === "-") {
				firstAppearance = "Unkown"
			}
			if (height["0"] === "-") {
				height = "Unkown"
			}
			if (weight["0"] === "- lb") {
				weight = "Unkown"
			}

			// llamando a la funcion que escribe los datos al dom 
			escribirDom(
				heroInfo,
				image,
				name,
				connections,
				publisher,
				occupation,
				firstAppearance,
				height,
				weight,
				aliases
			)
			// convierte los datos entregados por la variable powers para poder ser usados directamente en la grafica de canvasjs
			// tambien convierte la primera letra de el valor de los labels a mayuscula
			const graph = Object.entries(powers).map((e) => {
				const label = capitalizeFirstLetter(e[0])
				const y = e[1] * 1
				return {
					y,
					label,
				}
			})

			// llamando a la funcion que crea el grafico pasando los parametros graph y powers
			canvas(graph,powers)
		})
	})
})
// Funciones:

// funcion para escribir en el dom
function escribirDom(vari, img, name, con, pub, ocu, fa, he, we, ali) {
	vari.innerHTML = `
			<div class="mb-3 card" id="card">
				<div class="row g-0">
					<div class="col-md-4">
						<img src="${img}" class="img-fluid rounded-start" id="img">
					</div>
					<div class="col-md-8">
						<div class="card-body">
							<h5 class="card-title"><span class="fw-bold">Name:</span> ${name}</h5>
							<p class="card-text"><span class="fw-bold">Connections:</span> ${con}</p>
							<p class="card-text">
								<small class="text-muted"><span class="fw-bold">Publisher: ${pub}</span></small>
							</p>
							<p class="card-text"><span class="fw-bold">Occupation:</span> ${ocu}</p>
							<p class="card-text"><span class="fw-bold">First Appearance:</span> ${fa}</p>
							<p class="card-text"><span class="fw-bold">Height:</span> ${he}</p>
							<p class="card-text"><span class="fw-bold">Weight:</span> ${we}</p>
							<p class="card-text"><span class="fw-bold">Aliases:</span> ${ali}</p>
						</div>
					</div>
				</div>
		</div>`
}
// funcion que convierte la primera letra de un string a mayuscula
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

// funcion que crea el grafico.
function canvas(e1,e2){
	const config = {
		theme: "dark1",
		animationEnabled: true,
		backgroundColor: "transparent",
		title: {
			text: "Power stats",
		},
		data: [
			{
				type: "pie",
				startAngle: 25,
				toolTipContent: "<b>{label}</b>: {y}",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label} - {y}",
				dataPoints: e1,
			},
		],
	}
	if (e2.strength !== "null") {
		const chart = new CanvasJS.Chart("hero-stats", config)
		chart.render()
	} else {
		alert("El heroe seleccionado no tiene datos para mostrar en el grafico")
		heroStats.innerHTML = `<div class="emoji text-center">🩹</div>`
	}
}
