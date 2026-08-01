import re
import pickle
from difflib import get_close_matches
from dotenv import load_dotenv
import os

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


load_dotenv()

API_KEY = os.getenv("TMDB_API_KEY")

# ---------------- CONFIG ----------------
API_KEY = "5c862fac22de8294f771db73f7ccb2e7"
BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500"
PLACEHOLDER = "https://via.placeholder.com/500x750?text=No+Poster"
# ----------------------------------------

# Reuse the same HTTP connection
session = requests.Session()

# Poster cache
poster_cache = {}

movies = pickle.load(open("movies.pkl", "rb"))
similarity = pickle.load(open("similarity.pkl", "rb"))

# Reset dataframe index if needed
if not (
    movies.index.min() == 0
    and movies.index.max() == len(movies) - 1
    and movies.index.is_unique
):
    movies = movies.reset_index(drop=True)


def normalize(text: str):
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


movies["_norm_title"] = movies["title"].apply(normalize)


def fetch_poster(movie_id):

    if movie_id in poster_cache:
        return poster_cache[movie_id]

    try:

        url = f"https://api.themoviedb.org/3/movie/{movie_id}"

        response = session.get(
            url,
            params={"api_key": API_KEY},
            timeout=5
        )

        if response.status_code == 200:

            data = response.json()

            poster_path = data.get("poster_path")

            if poster_path:

                poster_url = BASE_IMAGE_URL + poster_path

            else:

                poster_url = PLACEHOLDER

        else:

            poster_url = PLACEHOLDER

    except Exception as e:

        print(e)
        poster_url = PLACEHOLDER

    poster_cache[movie_id] = poster_url

    return poster_url


def find_movie_index(user_input):

    query = normalize(user_input)

    if not query:
        return None

    norm_titles = movies["_norm_title"]

    exact = movies[norm_titles == query]

    if not exact.empty:
        return exact.index[0]

    contains = movies[norm_titles.str.contains(re.escape(query), na=False)]

    if not contains.empty:
        return contains.loc[contains["_norm_title"].str.len().idxmin()].name

    query_words = set(query.split())

    def all_words(title):
        return query_words.issubset(set(title.split()))

    word_match = movies[norm_titles.apply(all_words)]

    if not word_match.empty:
        return word_match.loc[word_match["_norm_title"].str.len().idxmin()].name

    close = get_close_matches(
        query,
        norm_titles.tolist(),
        n=1,
        cutoff=0.5
    )

    if close:
        return norm_titles[norm_titles == close[0]].index[0]

    return None


def recommend(movie):

    movie_index = find_movie_index(movie)

    if movie_index is None:
        return []

    distances = similarity[movie_index]

    movie_list = sorted(
        enumerate(distances),
        key=lambda x: x[1],
        reverse=True
    )[1:6]

    recommendations = []

    for i, _ in movie_list:

        movie_data = movies.iloc[i]

        recommendations.append({
            "title": movie_data["title"],
            "poster": fetch_poster(movie_data["id"])
        })

    return recommendations


@app.route("/")
def home():
    return "Movie Recommendation API Running 🚀"


@app.route("/movies")
def get_movies():
    return jsonify(list(movies["title"]))


@app.route("/recommend", methods=["POST"])
def recommendation():

    data = request.get_json(silent=True) or {}

    movie = data.get("movie", "")

    if not movie:
        return jsonify({"error": "Movie name required"}), 400

    return jsonify(recommend(movie))


if __name__ == "__main__":
    app.run(debug=True)