json.extract! task, :id, :title, :completed
json.url api_todo_url(task, format: :json)