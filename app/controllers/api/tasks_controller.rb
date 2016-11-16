module Api
  class TasksController < ApplicationController
    before_action :set_task, only: [:show, :edit, :update, :destroy]

    # GET /tasks
    # GET /tasks.json
    def index
      @tasks = Task.all
    end

    # DELETE /tasks
    # DELETE /tasks.json
    def completed
      Task.where(completed: true).delete_all
      respond_to do |format|
        format.html { redirect_to tasks_url, notice: 'Tasks were successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    # GET /tasks/1
    # GET /tasks/1.json
    def show
    end

    # POST /tasks
    # POST /tasks.json
    def create
      @task = Task.new(task_params)

      respond_to do |format|
        if @task.save
          format.html { redirect_to @task, notice: 'Task was successfully created.' }
          format.json { render :show, status: :created, location: api_todo_url(@task) }
        else
          format.html { render :new }
          format.json { render json: @task.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /tasks/1
    # PATCH/PUT /tasks/1.json
    def update
      respond_to do |format|
        if @task.update(task_params)
          format.html { redirect_to @task, notice: 'Task was successfully updated.' }
          format.json { render :show, status: :ok, location: api_todo_url(@task) }
        else
          format.html { render :edit }
          format.json { render json: @task.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /tasks/1
    # DELETE /tasks/1.json
    def destroy
      @task.destroy
      respond_to do |format|
        format.html { redirect_to tasks_url, notice: 'Task was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_task
        @task = Task.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def task_params
        params.require(:task).permit(:title, :completed)
      end
  end
end