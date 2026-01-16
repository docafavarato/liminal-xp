import requests

class Posts:
    def __init__(self):
        self.base_url = "http://localhost:8080/posts"
        self.auth = ("liminal-manager", "1f3a5ad34b")
        
    def findAll(self, orderByDate=False):
        if orderByDate:
            req = requests.get(self.base_url + "/orderByDate", auth=self.auth).json()
        else:
            req = requests.get(self.base_url, auth=self.auth).json()
        return req
    
    def findById(self, id):
        req = requests.get(self.base_url + f"/{id}", auth=self.auth).json()
        return req
    
    def insert(self, json, boardId):
        req = requests.post(self.base_url + f"/create?boardId={boardId}", json=json, auth=self.auth)
        return req
    
    def deleteById(self, id):
        req = requests.delete(self.base_url + f"/{id}", auth=self.auth)
        return req
    
class Replies:
    def __init__(self):
        self.base_url = "http://localhost:8080/replies"
        self.auth = ("liminal-manager", "1f3a5ad34b")
        
    def findAll(self):
        req = requests.get(self.base_url, auth=self.auth).json()
        return req
    
    def findById(self, id):
        req = requests.get(self.base_url + f"/{id}", auth=self.auth).json()
        return req
    
    def insert(self, json, postId):
        req = requests.post(self.base_url + f"/create?postId={postId}", json=json, auth=self.auth)
        return req
    
    def deleteById(self, id):
        req = requests.delete(self.base_url + f"/{id}", auth=self.auth)
        return req
    
class Boards:
    def __init__(self):
        self.base_url = "http://localhost:8080/boards"
        self.auth = ("liminal-manager", "1f3a5ad34b")
        
    def findAll(self, orderByDate=False):
        if orderByDate:
            req = requests.get(self.base_url + "/orderByDate", auth=self.auth).json()
        else:
            req = requests.get(self.base_url, auth=self.auth).json()
        return req
    
    def findById(self, id):
        req = requests.get(self.base_url + f"/{id}", auth=self.auth).json()
        return req
    
    def insert(self, json):
        req = requests.post(self.base_url + f"/create", json=json, auth=self.auth)
        return req
    
    def deleteById(self, id):
        req = requests.delete(self.base_url + f"/{id}", auth=self.auth)
        return req

    def findPostsByBoardId(self, id, orderByDate=False):
        if orderByDate:
            req = requests.get(self.base_url + f"/{id}/posts/orderByDate", auth=self.auth).json()
        else:
            req = requests.get(self.base_url + f"/{id}/posts", auth=self.auth).json()
        return req
