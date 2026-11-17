extends Node3D

const FIELD_W := 22.0
const FIELD_L := 36.0
const MATCH_SECONDS := 90

var player: CharacterBody3D
var ball: CharacterBody3D
var opponents: Array[CharacterBody3D] = []
var camera: Camera3D
var move_dir := Vector2.ZERO
var sprinting := false
var score_player := 0
var score_cpu := 0
var time_left := MATCH_SECONDS
var match_over := false
var coins := 1000
var wins := 0
var matches := 0
var score_label: Label
var timer_label: Label
var message_label: Label

func _ready() -> void:
	_load_career()
	_build_world()
	_build_hud()
	_start_clock()

func _build_world() -> void:
	var env := WorldEnvironment.new()
	var environment := Environment.new()
	environment.background_mode = Environment.BG_COLOR
	environment.background_color = Color("#07131d")
	environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	environment.ambient_light_color = Color(0.72, 0.82, 0.9)
	environment.ambient_light_energy = 0.8
	env.environment = environment
	add_child(env)
	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-55, -25, 0)
	sun.light_energy = 1.35
	add_child(sun)
	_make_box("Pitch", Vector3(FIELD_W, 0.35, FIELD_L), Vector3(0, -0.25, 0), Color("#187b45"))
	_make_line(Vector3(0, -0.06, 0), Vector3(FIELD_W, 0.025, 0.08), Color.WHITE)
	_make_ring(Vector3(0, -0.04, 0), 3.2, Color.WHITE)
	_make_box("TopPenalty", Vector3(10, 0.025, 5), Vector3(0, -0.04, -15.5), Color("#d9f3df"))
	_make_box("BottomPenalty", Vector3(10, 0.025, 5), Vector3(0, -0.04, 15.5), Color("#d9f3df"))
	_make_box("TopGoal", Vector3(5, 2.2, 0.5), Vector3(0, 0.9, -18.2), Color("#e8edf0"))
	_make_box("BottomGoal", Vector3(5, 2.2, 0.5), Vector3(0, 0.9, 18.2), Color("#e8edf0"))
	player = _make_player("KWG Player", Vector3(0, 0.7, 10), Color("#28a8ff"))
	ball = _make_ball(Vector3(0, 0.45, 8.7))
	for i in range(4):
		var enemy := _make_player("CPU " + str(i + 1), Vector3((i % 2) * 7.0 - 3.5, 0.7, -5.0 - int(i / 2) * 5.0), Color("#f04d52"))
		opponents.append(enemy)
	camera = Camera3D.new()
	camera.position = Vector3(0, 20, 24)
	camera.rotation_degrees = Vector3(-38, 0, 0)
	camera.current = true
	add_child(camera)

func _make_box(label: String, size: Vector3, pos: Vector3, tint: Color) -> MeshInstance3D:
	var mesh := BoxMesh.new()
	mesh.size = size
	var instance := MeshInstance3D.new()
	instance.name = label
	instance.mesh = mesh
	instance.position = pos
	var mat := StandardMaterial3D.new()
	mat.albedo_color = tint
	instance.material_override = mat
	add_child(instance)
	return instance

func _make_line(pos: Vector3, size: Vector3, tint: Color) -> void:
	_make_box("Field marking", size, pos, tint)

func _make_ring(pos: Vector3, radius: float, tint: Color) -> void:
	var ring := MeshInstance3D.new()
	var mesh := TorusMesh.new()
	mesh.inner_radius = radius - 0.035
	mesh.outer_radius = radius
	ring.mesh = mesh
	ring.position = pos
	var mat := StandardMaterial3D.new()
	mat.albedo_color = tint
	ring.material_override = mat
	add_child(ring)

func _make_player(label: String, pos: Vector3, tint: Color) -> CharacterBody3D:
	var body := CharacterBody3D.new()
	body.name = label
	body.position = pos
	var capsule := CapsuleMesh.new()
	capsule.radius = 0.48
	capsule.height = 1.4
	var visual := MeshInstance3D.new()
	visual.mesh = capsule
	var mat := StandardMaterial3D.new()
	mat.albedo_color = tint
	mat.roughness = 0.72
	visual.material_override = mat
	body.add_child(visual)
	var collider := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.radius = 0.48
	shape.height = 1.4
	collider.shape = shape
	body.add_child(collider)
	add_child(body)
	return body

func _make_ball(pos: Vector3) -> CharacterBody3D:
	var body := CharacterBody3D.new()
	body.name = "Football"
	body.position = pos
	var mesh := SphereMesh.new()
	mesh.radius = 0.34
	mesh.height = 0.68
	var visual := MeshInstance3D.new()
	visual.mesh = mesh
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color.WHITE
	visual.material_override = mat
	body.add_child(visual)
	var collider := CollisionShape3D.new()
	var shape := SphereShape3D.new()
	shape.radius = 0.34
	collider.shape = shape
	body.add_child(collider)
	add_child(body)
	return body

func _build_hud() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)
	var panel := ColorRect.new()
	panel.color = Color(0.02, 0.06, 0.1, 0.82)
	panel.position = Vector2(12, 10)
	panel.size = Vector2(300, 76)
	layer.add_child(panel)
	score_label = Label.new()
	score_label.position = Vector2(24, 16)
	score_label.add_theme_font_size_override("font_size", 27)
	score_label.add_theme_color_override("font_color", Color("#c5f66b"))
	layer.add_child(score_label)
	timer_label = Label.new()
	timer_label.position = Vector2(25, 52)
	timer_label.add_theme_font_size_override("font_size", 17)
	layer.add_child(timer_label)
	message_label = Label.new()
	message_label.position = Vector2(330, 20)
	message_label.size = Vector2(600, 40)
	message_label.add_theme_font_size_override("font_size", 20)
	message_label.add_theme_color_override("font_color", Color("#d8f6b2"))
	layer.add_child(message_label)
	_add_button(layer, "▲", Vector2(100, 340), Vector2(76, 58), func(): move_dir = Vector2(0, -1), func(): move_dir = Vector2.ZERO)
	_add_button(layer, "▼", Vector2(100, 458), Vector2(76, 58), func(): move_dir = Vector2(0, 1), func(): move_dir = Vector2.ZERO)
	_add_button(layer, "◀", Vector2(20, 400), Vector2(76, 58), func(): move_dir = Vector2(-1, 0), func(): move_dir = Vector2.ZERO)
	_add_button(layer, "▶", Vector2(180, 400), Vector2(76, 58), func(): move_dir = Vector2(1, 0), func(): move_dir = Vector2.ZERO)
	_add_button(layer, "SPRINT", Vector2(770, 400), Vector2(165, 58), func(): sprinting = true, func(): sprinting = false)
	_add_button(layer, "PASS", Vector2(770, 330), Vector2(78, 58), func(): _pass_ball(), func(): pass)
	_add_button(layer, "SHOOT", Vector2(855, 330), Vector2(78, 58), func(): _shoot_ball(), func(): pass)
	_refresh_hud()

func _add_button(parent: Control, caption: String, pos: Vector2, dimensions: Vector2, down: Callable, up: Callable) -> void:
	var button := Button.new()
	button.text = caption
	button.position = pos
	button.size = dimensions
	button.add_theme_font_size_override("font_size", 18)
	button.button_down.connect(down)
	button.button_up.connect(up)
	parent.add_child(button)

func _start_clock() -> void:
	var clock := Timer.new()
	clock.wait_time = 1.0
	clock.timeout.connect(func():
		if match_over:
			return
		time_left -= 1
		if time_left <= 0:
			_finish_match()
		_refresh_hud()
	)
	add_child(clock)
	clock.start()

func _physics_process(delta: float) -> void:
	if match_over:
		return
	var speed := 10.5 if sprinting else 6.2
	player.velocity = Vector3(move_dir.x * speed, 0, move_dir.y * speed)
	player.move_and_slide()
	player.position.x = clampf(player.position.x, -FIELD_W / 2 + 0.7, FIELD_W / 2 - 0.7)
	player.position.z = clampf(player.position.z, -FIELD_L / 2 + 0.7, FIELD_L / 2 - 0.7)
	for enemy in opponents:
		var direction := Vector2(ball.position.x - enemy.position.x, ball.position.z - enemy.position.z)
		if direction.length() > 1.2:
			enemy.velocity = Vector3(direction.normalized().x * 3.2, 0, direction.normalized().y * 3.2)
		else:
			enemy.velocity = Vector3.ZERO
		enemy.move_and_slide()
	if ball.position.distance_to(player.position) < 1.7 and move_dir.length() > 0:
		ball.position.x = lerpf(ball.position.x, player.position.x + move_dir.x * 1.1, delta * 8)
		ball.position.z = lerpf(ball.position.z, player.position.z + move_dir.y * 1.1, delta * 8)
	ball.position.x = clampf(ball.position.x, -FIELD_W / 2 + 0.4, FIELD_W / 2 - 0.4)
	ball.position.z = clampf(ball.position.z, -FIELD_L / 2 + 0.4, FIELD_L / 2 - 0.4)
	camera.position = Vector3(player.position.x * 0.25, 20, player.position.z + 14)
	camera.look_at(player.position + Vector3(0, 0, -3), Vector3.UP)

func _pass_ball() -> void:
	if match_over:
		return
	ball.position = player.position + Vector3(0, 0, -2.0)
	message_label.text = "PASI IMETOKA!"

func _shoot_ball() -> void:
	if match_over:
		return
	ball.position = player.position + Vector3(0, 0, -2.0)
	if player.position.z < -7 and absf(player.position.x) < 5.5:
		score_player += 1
		message_label.text = "GOOOOL! UMEFUNGAAA!"
		ball.position = Vector3(0, 0.45, 8.7)
		player.position = Vector3(0, 0.7, 10)
	else:
		message_label.text = "SHUTI! SONGA KARIBU NA GOLI."

func _finish_match() -> void:
	match_over = true
	matches += 1
	var reward := 150 if score_player > score_cpu else 75 if score_player == score_cpu else 25
	if score_player > score_cpu:
		wins += 1
	coins += reward
	_save_career()
	message_label.text = "MECHI IMEISHA • COINS +%d" % reward

func _refresh_hud() -> void:
	if score_label:
		score_label.text = "KWG FC   %d - %d   CPU FC" % [score_player, score_cpu]
	if timer_label:
		timer_label.text = "%02d:%02d" % [time_left / 60, time_left % 60]

func _load_career() -> void:
	var cfg := ConfigFile.new()
	if cfg.load("user://career.cfg") == OK:
		coins = int(cfg.get_value("career", "coins", 1000))
		wins = int(cfg.get_value("career", "wins", 0))
		matches = int(cfg.get_value("career", "matches", 0))

func _save_career() -> void:
	var cfg := ConfigFile.new()
	cfg.set_value("career", "coins", coins)
	cfg.set_value("career", "wins", wins)
	cfg.set_value("career", "matches", matches)
	cfg.save("user://career.cfg")
