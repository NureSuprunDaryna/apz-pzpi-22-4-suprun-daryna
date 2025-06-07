from locust import HttpUser, task, between

class ElixirUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        self.client.post("/account/login", json={"nickname": "test", "password": "123456"})

    @task(3)
    def get_elixirs(self):
        self.client.get("/elixirs")

    @task(1)
    def create_preferences(self):
        self.client.post("/preferences/create", json={"likedNotes": "1,2", "dislikedNotes": "102,28"})
