import { useState, useEffect } from "react";
import styles from "../styles/gameboard.module.css";

const API_KEY = "22452995-b5a25cb86b47da4fa063cf08c"; // Replace with your actual key

export default function GameBoard({ gridSize, onGameComplete, level }) {
  const totalTiles = gridSize * gridSize;
  const [tiles, setTiles] = useState([]);
  const [flippedTiles, setFlippedTiles] = useState([]);
  const [matchedTiles, setMatchedTiles] = useState([]);
  const [steps, setSteps] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    initializeTiles();
  }, [gridSize, level]);

  useEffect(() => {
    let timer;
    if (isPlaying && matchedTiles.length < totalTiles) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying, matchedTiles]);

  useEffect(() => {
    if (matchedTiles.length === totalTiles) {
      setIsPlaying(false);
      console.log("📌 Time sent to onGameComplete:", time);
      onGameComplete(time); // ✅ FIXED: Only pass time
    }
  }, [matchedTiles]);

  const fetchImages = async (query, count) => {
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
          query
        )}&image_type=photo&per_page=${count}`
      );
      const data = await response.json();
      return data.hits.map((img) => img.webformatURL);
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  };

  const initializeTiles = async () => {
    const categoryMap = {
      easy: "fruits",
      medium: "animals",
      hard: "cars",
    };

    const selectedCategory = categoryMap[level] || "fruits";
    const totalPairs = totalTiles / 2;

    const images = await fetchImages(selectedCategory, totalPairs);
    if (images.length < totalPairs) {
      console.error("Not enough images returned from API.");
      return;
    }

    let pairs = [...images, ...images]; // Duplicate images to create pairs
    pairs.sort(() => Math.random() - 0.5); // Shuffle pairs

    setTiles(
      pairs.map((value, index) => ({ id: index, value, flipped: false }))
    );
    setSteps(0);
    setTime(0);
    setIsPlaying(false);
    setFlippedTiles([]);
    setMatchedTiles([]);
  };

  const handleTileClick = (id) => {
    if (flippedTiles.length === 2 || matchedTiles.includes(id)) return;
    if (flippedTiles.includes(id)) return;
    if (!isPlaying) setIsPlaying(true);

    const updatedTiles = tiles.map((tile) =>
      tile.id === id ? { ...tile, flipped: true } : tile
    );

    setFlippedTiles((prev) => [...prev, id]);
    setTiles(updatedTiles);

    if (flippedTiles.length === 1) {
      setSteps((prev) => prev + 1);
      setTimeout(() => checkMatch(updatedTiles, [...flippedTiles, id]), 500);
    }
  };

  const checkMatch = (updatedTiles, newFlippedTiles) => {
    const [first, second] = newFlippedTiles;

    if (first === undefined || second === undefined) return;

    if (updatedTiles[first].value === updatedTiles[second].value) {
      setMatchedTiles((prev) => [...prev, first, second]);
      setFlippedTiles([]);
    } else {
      setTimeout(() => {
        const resetTiles = updatedTiles.map((tile) =>
          tile.id === first || tile.id === second ? { ...tile, flipped: false } : tile
        );
        setTiles(resetTiles);
        setFlippedTiles([]);
      }, 500);
    }
  };

  return (
    <div>
      <div className={styles.stats}>
        <p>Steps: {steps}</p>
        <p>Time: {time}s</p>
      </div>
      <div className={styles.board} style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={`${styles.tile} ${tile.flipped ? styles.flipped : ""}`}
            onClick={() => handleTileClick(tile.id)}
          >
            {tile.flipped || matchedTiles.includes(tile.id) ? (
              <img src={tile.value} alt="Tile" className={styles.tileImage} />
            ) : "?"}
          </div>
        ))}
      </div>
    </div>
  );
}