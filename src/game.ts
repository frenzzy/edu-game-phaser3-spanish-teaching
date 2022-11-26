type World = Phaser.Types.GameObjects.Group.GroupCreateConfig & {
  key: string
  spanish: string
  sound: Phaser.Sound.BaseSound | null
}

class Game extends Phaser.Scene {
  correctSound: Phaser.Sound.BaseSound | null = null
  wrongSound: Phaser.Sound.BaseSound | null = null
  wordText: Phaser.GameObjects.Text | null = null
  nextWord: World | null = null
  words: World[] = [
    {
      key: 'building',
      setXY: { x: 100, y: 240 },
      spanish: 'edificio',
      sound: null,
    },
    {
      key: 'house',
      setXY: { x: 240, y: 280 },
      setScale: { x: 0.8, y: 0.8 },
      spanish: 'casa',
      sound: null,
    },
    {
      key: 'car',
      setXY: { x: 400, y: 300 },
      setScale: { x: 0.8, y: 0.8 },
      spanish: 'automóvil',
      sound: null,
    },
    {
      key: 'tree',
      setXY: { x: 550, y: 250 },
      spanish: 'árbol',
      sound: null,
    },
  ]
  preload() {
    this.load.image('background', 'assets/images/background-city.png')
    this.load.image('building', 'assets/images/building.png')
    this.load.image('car', 'assets/images/car.png')
    this.load.image('house', 'assets/images/house.png')
    this.load.image('tree', 'assets/images/tree.png')

    this.load.audio('treeAudio', 'assets/audio/arbol.mp3')
    this.load.audio('carAudio', 'assets/audio/auto.mp3')
    this.load.audio('houseAudio', 'assets/audio/casa.mp3')
    this.load.audio('buildingAudio', 'assets/audio/edificio.mp3')
    this.load.audio('correct', 'assets/audio/correct.mp3')
    this.load.audio('wrong', 'assets/audio/wrong.mp3')
  }

  create() {
    const bg = this.add.sprite(0, 0, 'background').setOrigin(0, 0)
    bg.setInteractive()

    const group = this.add.group()
    group.createMultiple(this.words)
    for (const [i, obj] of group.getChildren().entries()) {
      const item = obj as Phaser.GameObjects.Sprite & {
        correctTween: Phaser.Tweens.Tween
        wrongTween: Phaser.Tweens.Tween
        alphaTween: Phaser.Tweens.Tween
      }
      item.setInteractive()

      item.correctTween = this.tweens.add({
        targets: item,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 1000,
        paused: true,
        yoyo: true,
        ease: 'Quad.easeInOut',
      })

      item.wrongTween = this.tweens.add({
        targets: item,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 1000,
        angle: 90,
        paused: true,
        yoyo: true,
        ease: 'Quad.easeInOut',
      })

      item.alphaTween = this.tweens.add({
        targets: item,
        alpha: 0.7,
        duration: 200,
        paused: true,
      })

      item.on('pointerdown', () => {
        const result = this.processAnswer(this.words[i].spanish)
        if (result) {
          item.correctTween.play()
        } else {
          item.wrongTween.play()
        }
        this.showNextQuestion()
      })

      item.on('pointerover', () => {
        item.alphaTween.play()
      })

      item.on('pointerout', () => {
        item.alphaTween.stop()
        item.alpha = 1
      })

      this.words[i].sound = this.sound.add(this.words[i].key + 'Audio')
    }

    this.wordText = this.add.text(30, 20, ' ', {
      font: '24px Open Sans',
      color: '#fff',
    })

    this.correctSound = this.sound.add('correct')
    this.wrongSound = this.sound.add('wrong')

    this.showNextQuestion()
  }

  showNextQuestion() {
    this.nextWord = Phaser.Math.RND.pick(this.words)
    this.nextWord.sound!.play()
    this.wordText!.setText(this.nextWord.spanish)
  }

  processAnswer(userResponse: string) {
    if (userResponse === this.nextWord!.spanish) {
      this.correctSound!.play()
      return true
    }

    this.wrongSound!.play()
    return false
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: Game,
  title: 'Spanish Learning Game',
  pixelArt: false,
})
