import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, FormControl, Collapse } from "react-bootstrap";
import { Carousel } from 'react-bootstrap'
import "./App.css";

function App() {
  const cityList = ['Warszawa', 'Gdańsk', 'Gdynia', 'Sopot', 'Kraków', 'Los Angeles', 'Poznań', 'Atlanta', 'New York', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville'];

  const accessKey = "Nb5YGtqz4RLQ9kHz43_tfNe_XUn1mY4Y1Kp-IzekZF0"
  const apiKey = "1d342e185959e0409946f8fcb4364c85"

  const [inputText, setInputText] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("C");
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState([]);
  const [cityName, setCityName] = useState("Kraków");

  useEffect(() => {
    fetch(
      `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${accessKey}`
    )
      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        if (data.results) {
          setImage(data.results.slice(0, 3));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&lang=pl&units=metric`
    )
      .then((response) => {
        if (response.status === 200) {
          error && setError(false);
          return response.json();
        } else {
          throw new Error("An error occured while fetching API.");
        }
      })
      .then((data) => {
        setData(data)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [cityName, error]);

  const search = (searchTerm) => {
    setCityName(searchTerm);
    if (!searchTerm) {
      alert("Miasto nie może być puste!");
      return;
    }
    setInputText("");
    fetch(
      `https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=${accessKey}`
    )
      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        if (data.results) {
          setImage(data.results.slice(0, 3));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      search(e.target.value);
    }
  }

  const handleSearchClick = () => {
    search(inputText);
  }

  const handleUnitChange = () => {
    setUnit(unit === "C" ? "F" : "C")
  }

  const generateRandomCity = () => {
    const randomIndex = Math.floor(Math.random() * cityList.length);
    const randomCity = cityList[randomIndex];
    setCityName(randomCity);
    search(randomCity)
  }

  return (
    <div className="bg_img">

      <header>
        Pogoda w mieście {cityName}
      </header>

      {
        !loading ? (
          <>
          <Button onClick={generateRandomCity} className="randomButton">
            <i class="bi bi-dice-3"></i> Wylosuj Miasto
          </Button>

            <div className="center-content">
              <Button variant="outline-secondary" className="metricButton" onClick={handleUnitChange}>
                {unit === "C" ? "°C" : "°F"}
              </Button>

              <FormControl type="text" placeholder="Wyszukaj Miasto" className="input form-control" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleSearch} isInvalid={error} />

              <Button className="searchButton" onClick={handleSearchClick}>
                <i className="bi bi-search"></i>
              </Button>
            </div>

            <div className="carouselContainer">
              <Carousel>
                {image.map((image, index) => (
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src={image.urls.small}
                      alt={image.alt_description}
                    />

                  </Carousel.Item>
                ))}
              </Carousel>
            </div>

            <div className="group-container bg-secondary">
              <div className="group">
                <div className="center-content">
                  <h1 className="city">{data.name}</h1><h4 className="cityCountry">{data.sys.country}</h4>
                  <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="" />
                </div>
              </div>

              <h1 className="temp">
                {unit === "C" ? data.main.temp.toFixed() : (data.main.temp * 9 / 5 + 32).toFixed()}°{unit}
              </h1>

              <h1 className="condition">
                {data.weather[0].description.replace(/^\w/, c => c.toUpperCase())}.
              </h1>
            </div>

            <Button className="hideButton" onClick={() => setIsVisible(!isVisible)}>
              <i class={isVisible ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              {isVisible ? " Szczegóły" : " Szczegóły"}
            </Button>

            <Collapse in={isVisible}>
              <div className="box_container">
                <div className="box bg-secondary">
                  <p><i className="bi bi-moisture"></i> Wilgoć</p>
                  <h1>{data.main.humidity.toFixed()}%</h1>
                </div>

                <div className="box bg-secondary">
                  <p><i className="bi bi-thermometer"></i> Odczuwalne</p>
                  <h1>{unit === "C" ? data.main.feels_like.toFixed() : (data.main.feels_like * 9 / 5 + 32).toFixed()}°{unit}</h1>
                </div>

                <div className="box bg-secondary">
                  <p><i className="bi bi-wind"></i> Wiatr</p>
                  <h1>{data.wind.speed.toFixed()} km/h</h1>
                </div>

                <div className="box bg-secondary">
                  <p><i className="bi bi-stopwatch"></i> Ciśnienie</p>
                  <h1>{data.main.pressure} hPa</h1>
                </div>

                <div className="box bg-secondary">
                  <p><i className="bi bi-sunrise"></i> Wschód Słońca</p>
                  <h1>{new Date(data.sys.sunrise * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</h1>
                </div>

                <div className="box bg-secondary">
                  <p><i className="bi bi-sunset"></i> Zachód Słońca</p>
                  <h1>{new Date(data.sys.sunset * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</h1>
                </div>

                <div className="box bg-secondary">
                  <p><i className="bi bi-eye"></i> Widoczność</p>
                  <h1>{data.visibility / 1000} km</h1>
                </div>

                <div className="box bg-secondary">
                  <p><i className="bi bi-clouds"></i> Zachmurzenie</p>
                  <h1>{data.clouds.all}%</h1>
                </div>

                <div className="box bg-secondary">
                  <p><i className="bi bi-arrow-up-right"></i> Kierunek Wiatru</p>
                  <h1>{data.wind.deg}°</h1>
                </div>
              </div>
            </Collapse>
          </>) : (<CircularProgress />)
      }

      <footer>
        Projekt na zaliczenie | OpenWeather API, Unsplash API + React & Bootstrap
      </footer>

    </div>
  );
}

export default App;
