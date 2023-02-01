import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() text = '';
  @Input() bgColor: string | 'auto' = '#000066'
  @Input() bgAuto = false;
  @Input() size: 'sm' | 'md' | 'lg'  = 'md'

  bgChoices = ['#000066', '#FFA2AD', '#2F51AE', '#007F6E', '#00BD3E', '#39B54A', '#FFB000', '#EB0000', '#55CCAB', '#B6E5C8']

  constructor() { 
  }

  ngOnInit(): void {
    if(this.bgAuto) {
      let sum = 0
      for (let i = 0; i < this.text.length; i++) {
        sum += this.text.charCodeAt(i)
      }
      this.bgColor = this.bgChoices[sum % this.bgChoices.length]
      console.log('running bgAuto', this.text, this.bgAuto, this.bgColor)
    }
  }

  getTextInitials(text: string) {
    const avatar_name=text.replace(/[^a-zA-Z ]/g, "");
    return avatar_name.split(' ').slice(0,2).map(n => n[0]).join('');
  }

}
