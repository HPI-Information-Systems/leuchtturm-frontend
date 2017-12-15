from flask import url_for


class TestPingPong:
    def test_ping_pong(self, client):
        res = client.get(url_for('api.ping'))
        assert res.status_code == 200
        assert res.json['response'] == 'pong'

    def test_ping_pong_count_3(self, client):
        res = client.get(url_for('api.ping', count=3))
        assert res.status_code == 200
        assert res.json['response'] == ['pong', 'pong', 'pong']

    def test_ping_pong_count_0(self, client):
        res = client.get(url_for('api.ping', count=0))
        assert res.status_code == 200
        assert res.json['response'] == []