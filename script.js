$(function () {
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

        $('#view-project-name').text('Project Name: ' + projectName);
        $('#view-task-name').text('Task Name: ' + taskName);
        $('#view-description').text('Description: ' + description);

        viewModal.show();
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
        .html(`${projectName}<br>${taskName}`);

    $('#todo-tasks').append(taskCard);

    $('#project-name').val('');
    $('#task-name').val('');
    $('#description').val('');

    taskCard.on('dragstart', function (e) {
        e.originalEvent.dataTransfer.setData('text', e.target.id);
        e.originalEvent.dataTransfer.effectAllowed = 'move';
    });
}
