from flask import Blueprint
from .model import Board
from connexion import request, NoContent
from flask_socketio import SocketIO, join_room, emit

boards = Blueprint('boards', __name__)

def dude():
    emit('BOARD_ADDED')

def create(body):
    """
        Responds to a POST request for /api/boards
        :return:
    """
    name = body['name']
    uid = body['uid']
    board = Board(name, uid)
    board.save()
    response = {
        'id': board.id,
        'name': board.name,
    }
    dude()
    return response, 201


def get(id):
    """
    Responds to GET request for /api/boards/<board_id>
    :param id:
    :return:
    """
    board = Board.query.filter_by(id=id).first()
    if board:
        result = {
            'id': board.id,
            'name': board.name,
        }
        return result, 200
    else:
        return 'Board does not exist', 404


def put(id, body):
    """
    Responds to PUT request for /api/boards/<board_id>
    :param id:
    :param body: the request body needs key: 'name'
    :return:
    """
    board = Board.query.filter_by(id=id).first()
    if board:
        board.update(body['name'])
        return 'Updated board to ' + board.name, 200
    else:
        return 'Board does not exist', 404


def delete(id):
    """
    :param id:
    Responds to DELETE request for /api/boards/<board_id>
    :return:
    """
    board = Board.query.filter_by(id=id).first()

    if board:
        board.delete()
        return NoContent, 204
    else:
        return 'Board does not exist', 404
