
import java.util.Scanner;

public class Demo2 {
  public static void main(String[] args) {
      Scanner sc = new Scanner(System.in);
      System.out.println("Enter value of n: ");
      int n = sc.nextInt();
      int sum = 0;
      int i = 1 ;
      while( i <= n){
        sum += i;
        i++;

      }
      System.out.println("Sum is: " + sum);
  }
}