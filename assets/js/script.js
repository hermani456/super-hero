// seleccion de elementos del dom
const form = document.querySelector("#form")
const heroInput = document.querySelector("#hero-input")
const heroInfo = document.querySelector("#hero-info")
const heroStats = document.querySelector("#hero-stats")

// variable con la url del api
const URL = "https://www.superheroapi.com/api.php/4905856019427443/"

form.addEventListener("submit", (e) => {
	e.preventDefault()
	const valueInput = heroInput.value
	// regex que chequea solo numeros positivos
	const patron = /^\d*[1-9]\d*$/
	// if que chequea que el numero ingresado este entre 1 y 732
	if (valueInput > 732 || (!valueInput.match(patron))) {
		alert("Solo se permiten numeros del rango: ( 1 - 732 )")
		return
	}
	fetch(URL + valueInput).then((respuesta) => {
		respuesta.json().then((data) => {
			// asignando variable a los datos entregados por json
			const powers = data.powerstats

			// llena con Unknown los datos que arrojen valor "-"
			if (data.connections["group-affiliation"] === "-") {
				data.connections["group-affiliation"] = "Unknown"
			}
			if (data.biography.publisher === "-") {
				data.biography.publisher = "Unknown"
			}
			if (data.work.occupation === "-") {
				data.work.occupation = "Unknown"
			}
			if (data.biography["first-appearance"] === "-") {
				data.biography["first-appearance"] = "Unknown"
			}
			if (data.appearance.height["0"] === "-") {
				data.appearance.height = "Unknown"
			}
			if (data.appearance.weight["0"] === "- lb") {
				data.appearance.weight = "Unknown"
			}
			if (data.biography.aliases["0"] === "-") {
				data.biography.aliases = "Unknown"
			}
			
			// llamando a la funcion que escribe los datos al dom 
			escribirDom(heroInfo,data)

			// convierte los datos entregados por la variable powers para poder ser usados directamente en la grafica de canvasjs
			// tambien convierte la primera letra de el valor de los labels a mayuscula y guarda todo en la variable graph
			const graph = Object.entries(powers).filter(power => power[1] !== 'null').map(power => {
				const label = capitalizeFirstLetter(power[0])
				const y = power[1] * 1
				return {y,label}
			})
		
			// llamando a la funcion que crea el grafico pasando los parametros graph y powers
			canvas(graph,powers)
		})
	})
})
// Funciones:

// funcion para escribir en el dom
function escribirDom(vari, dato) {
	vari.innerHTML = `
			<div class="mb-3 card" id="card">
				<div class="row g-0">
					<div class="col-md-4">
						<img src="${dato.image.url}" class="img-fluid rounded-start" id="img">
					</div>
					<div class="col-md-8">
						<div class="card-body">
							<h5 class="card-title"><span class="fw-bold">Name:</span> ${dato.name}</h5>
							<p class="card-text"><span class="fw-bold">Connections:</span> ${dato.connections["group-affiliation"]}</p>
							<p class="card-text">
								<small class="text-muted"><span class="fw-bold">Publisher: ${dato.biography.publisher}</span></small>
							</p>
							<p class="card-text"><span class="fw-bold">Occupation:</span> ${dato.work.occupation}</p>
							<p class="card-text"><span class="fw-bold">First Appearance:</span> ${dato.biography["first-appearance"]}</p>
							<p class="card-text"><span class="fw-bold">Height:</span> ${dato.appearance.height}</p>
							<p class="card-text"><span class="fw-bold">Weight:</span> ${dato.appearance.weight}</p>
							<p class="card-text"><span class="fw-bold">Aliases:</span> ${dato.biography.aliases}</p>
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
	if (e2.strength  !== "null") {
		const chart = new CanvasJS.Chart("hero-stats", config)
		chart.render()
	} else {
		alert("El heroe seleccionado no tiene datos para mostrar en el grafico")
		heroStats.innerHTML = `<div class="emoji text-center">🩹</div>`
	}
}
