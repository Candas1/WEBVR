AFRAME.registerComponent('input-listen', {
        init: function() {
            //Declaration and initialization of flag 
            //which exprains grip button is pressed or not.
            //"this.el" reffers ctlR or L in this function
            this.el.grip = false

            //Called when trigger is pressed 
            this.el.addEventListener('triggerdown', function(e) {
                //"this" reffers ctlR or L in this function
                const point = this.object3D.getWorldPosition()

                //txt.setAttribute("value",point.x.toFixed(2)+","+point.y.toFixed(2)+","+point.z.toFixed(2));

                //Creating ball entity.
                const ballsize = .1
                const ball = document.createElement('a-sphere')
                ball.setAttribute('class', 'ball')
                //ball.setAttribute('class', 'collidable')
                ball.setAttribute('radius', ballsize)
                ball.setAttribute('position', point)
                ball.setAttribute('dynamic-body', 'shape: sphere; sphereRadius: ' + ballsize + '; mass: .1;')
                //ball.setAttribute('static-body', 'shape: sphere; sphereRadius: ' + ballsize + '; mass: .1;')

                //Getting raycaster which was attached to ctrlR or L
                const dir = this.getAttribute("raycaster").direction

                //Setting shoot dierction and speed 
                const force = new THREE.Vector3(dir.x, dir.y, dir.z)
                force.normalize()
                force.multiplyScalar(50)
                ball.force = this.object3D.localToWorld(force)

                //Instantiate ball entity in a-scene
                const scene = document.querySelector('a-scene')
                scene.appendChild(ball)

                //shoot "ball" after physics information getting ready. 
                ball.addEventListener('body-loaded', function(e) {
                    //this.velocity was calculated before this function is called.
                    const f = this.force
                    this.body.applyForce(new CANNON.Vec3(f.x, f.y, f.z), new CANNON.Vec3())
                })
                /*
                ball.addEventListener('collide', function(e) {
                    //this.parentNode.removeChild(this)
                    this.removeAttribute('dynamic-body')
                    this.setAttribute('static-body', 'shape: sphere; sphereRadius: ' + ballsize + '; mass: .1;')
                    this.setAttribute('class', 'collidable')
                })
                */
            })
            
            //Grip Pressed
            this.el.addEventListener('gripdown', function(e) {
                //Setting grip flag as true.
                this.grip = true
            })
            //Grip Released
            this.el.addEventListener('gripup', function(e) {
                //Setting grip flag as false.
                this.grip = false
            })

            //Raycaster intersected with something.
            this.el.addEventListener('raycaster-intersection', function(e) {
                //Store first selected object as selectedObj 
                this.selectedObj = e.detail.els[0]
                /*
                textR.setAttribute('value', this.selectedObj.id)
                const ip = e.detail.intersection.point
                const op = this.selectedObj.object3D.position
                this.selectedPointD = new THREE.Vector3()
                this.selectedPointD.subVectors(op, ip)
                */
            })
            //Raycaster intersection is finished.
            this.el.addEventListener('raycaster-intersection-cleared', function(e) {
                //Clear information of selectedObj
                this.selectedObj = null
            })

            //A-buttorn Pressed 
            this.el.addEventListener('abuttondown', function(e) {
                //Aqurire all ball entities which are instantiated in a-scene
                const els = document.querySelectorAll('.ball')
                //Destroy all ball entities
                for (let i = 0; i < els.length; i++) {
                    els[i].parentNode.removeChild(els[i])
                }
            })
            //B-buttorn Pressed 
            this.el.addEventListener('bbuttondown', function(e) {
                location.reload()
            })

            //X-buttorn Pressed 
            this.el.addEventListener('xbuttondown', function(e) {
                //Start pointing position to teleport  
                this.emit('teleportstart')
            })
            //X-buttorn Released 
            this.el.addEventListener('xbuttonup', function(e) {
                //Jump to pointed position
                this.emit('teleportend')
            })
            /*
            pad.addEventListener('body-loaded', function(e) {
                console.log(this.body)
            })
            */
        },
        //called evry frame.
        tick: function () {
            if (!this.el.selectedObj || !this.el.grip) {
                return
            }
            //Getting raycaster component which is attatched to ctlR or L
            //this.el means entity of ctlR or L in this function.
            const ray = this.el.getAttribute("raycaster").direction
            //setting tip of raycaster as 1.2m forward of controller.  
            const p = new THREE.Vector3(ray.x, ray.y, ray.z)
            p.normalize()
            p.multiplyScalar(1.2)
            //Convert local position into world coordinate.
            this.el.object3D.localToWorld(p)
//            p.add(this.el.selectedPointD)
            //const ap = new THREE.Vector3(0, .5, 0) // 持つ場所をずらす
            //p.add(ap)
            //Move selected object to follow the tip of raycaster.
            this.el.selectedObj.object3D.position.set(p.x, p.y, p.z)
        }
    })

var cache = function(object) { 

 //alert(object); 
 document.querySelector('#'+ object).setAttribute("visible",false);
 
}

var montre = function(object) { 

 //alert(object); 
 document.querySelector('#'+ object).setAttribute("visible",true);
 
}


if (annyang) {
	
  annyang.setLanguage('fr-FR');
  
  // Let's define a command.
  var commands = {
    'cache :object': cache,
	'montre :object': montre
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening.
  annyang.start( {continuous: true} );
}
