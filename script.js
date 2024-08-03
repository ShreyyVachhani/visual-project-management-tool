$(function () {
    loadTasks();

    $('.task-card').on('dragstart', function (e) {
        e.originalEvent.dataTransfer.setData('text', e.target.id);
        e.originalEvent.dataTransfer.effectAllowed = 'move';
    });

    $('.tasks').on('dragover', function (e) {
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'move';
    });

    $('.tasks').on('drop', function (e) {
        e.preventDefault();
        const id = e.originalEvent.dataTransfer.getData('text');
        const task = $('#' + id);
        $(this).append(task);
        saveTasks();
    });

    // Modal handling for adding tasks
    var taskModal = $('#task-modal');
    var addTaskBtn = $('#add-task-btn');
    var taskCloseBtn = $('.close');

    addTaskBtn.on('click', function () {
        taskModal.show();
    });

    taskCloseBtn.on('click', function () {
        taskModal.hide();
    });

    $(window).on('click', function (event) {
        if ($(event.target).is(taskModal)) {
            taskModal.hide();
        }
    });

    // Modal handling for viewing task details
    var viewModal = $('#view-modal');
    var viewCloseBtn = $('.close-view');

    $(document).on('click', '.task-card', function () {
        var projectName = $(this).data('project');
        var taskName = $(this).data('task');
        var description = $(this).data('description');
        var comments = $(this).data('comments') || [];

        $('#view-project-name').text('Project Name: ' + projectName);
        $('#view-task-name').text('Task Name: ' + taskName);
        $('#view-description').text('Description: ' + description);

        var commentsList = $('#comments-list');
        commentsList.empty();
        comments.forEach(comment => {
            commentsList.append('<p>' + comment + '</p>');
        });

        viewModal.data('task-id', $(this).attr('id')).show();
    });

    viewCloseBtn.on('click', function () {
        viewModal.hide();
    });

    $(window).on('click', function (event) {
        if ($(event.target).is(viewModal)) {
            viewModal.hide();
        }
    });

    // Add task form submission
    $('#task-form').on('submit', function (event) {
        event.preventDefault();
        addTask();
        taskModal.hide();
    });

    // Add comment form submission
    $('#comment-form').on('submit', function (event) {
        event.preventDefault();
        addComment();
    });
});

function addTask() {
    const projectName = $('#project-name').val();
    const taskName = $('#task-name').val();
    const description = $('#description').val();

    if (taskName.trim() === '') return;

    const taskId = 'task-' + new Date().getTime();
    const taskCard = $('<div></div>')
        .addClass('task-card')
        .attr('id', taskId)
        .attr('draggable', 'true')
        .attr('data-project', projectName)
        .attr('data-task', taskName)
        .attr('data-description', description)
        .attr('data-comments', '[]')
        .html(`
            <div class="project-name">${projectName}</div>
            <div class="task-name">${taskName}</div>
            <div class="notification-icon" style="display:block;"></div>
        `);

    $('#todo-tasks').append(taskCard);

    $('#project-name').val('');
    $('#task-name').val('');
    $('#description').val('');

    taskCard.on('dragstart', function (e) {
        e.originalEvent.dataTransfer.setData('text', e.target.id);
        e.originalEvent.dataTransfer.effectAllowed = 'move';
    });

    taskCard.on('click', function () {
        var projectName = $(this).data('project');
        var taskName = $(this).data('task');
        var description = $(this).data('description');
        var comments = $(this).data('comments') || [];

        $('#view-project-name').text('Project Name: ' + projectName);
        $('#view-task-name').text('Task Name: ' + taskName);
        $('#view-description').text('Description: ' + description);

        var commentsList = $('#comments-list');
        commentsList.empty();
        comments.forEach(comment => {
            commentsList.append('<p>' + comment + '</p>');
        });

        $('#view-modal').data('task-id', $(this).attr('id')).show();
    });

    saveTasks();
}

function addComment() {
    const comment = $('#comment').val();
    const taskId = $('#view-modal').data('task-id');
    const taskCard = $('#' + taskId);
    const comments = taskCard.data('comments') || [];
    comments.push(comment);
    taskCard.data('comments', comments);
    $('#comment').val('');

    const commentsList = $('#comments-list');
    commentsList.append('<p>' + comment + '</p>');

    taskCard.find('.notification-icon').show();

    saveTasks();
}

function saveTasks() {
    const tasks = [];
    $('.task-card').each(function () {
        const task = {
            id: $(this).attr('id'),
            project: $(this).data('project'),
            task: $(this).data('task'),
            description: $(this).data('description'),
            comments: $(this).data('comments') || [],
            column: $(this).parent().attr('id')
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskCard = $('<div></div>')
            .addClass('task-card')
            .attr('id', task.id)
            .attr('draggable', 'true')
            .attr('data-project', task.project)
            .attr('data-task', task.task)
            .attr('data-description', task.description)
            .attr('data-comments', JSON.stringify(task.comments))
            .html(`
                <div class="project-name">${task.project}</div>
                <div class="task-name">${task.task}</div>
                <div class="notification-icon" style="display:none;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>
            `);

        $('#' + task.column).append(taskCard);

        taskCard.on('dragstart', function (e) {
            e.originalEvent.dataTransfer.setData('text', e.target.id);
            e.originalEvent.dataTransfer.effectAllowed = 'move';
        });

        taskCard.on('click', function () {
            var projectName = $(this).data('project');
            var taskName = $(this).data('task');
            var description = $(this).data('description');
            var comments = $(this).data('comments') || [];

            $('#view-project-name').text('Project Name: ' + projectName);
            $('#view-task-name').text('Task Name: ' + taskName);
            $('#view-description').text('Description: ' + description);

            var commentsList = $('#comments-list');
            commentsList.empty();
            comments.forEach(comment => {
                commentsList.append('<p>' + comment + '</p>');
            });

            $('#view-modal').data('task-id', $(this).attr('id')).show();
        });
    });
}
