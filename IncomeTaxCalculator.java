import java.util.Scanner;

public class IncomeTaxCalculator {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        
        System.out.println("=====================================");
        System.out.println("    INCOME TAX CALCULATOR");
        System.out.println("=====================================");
        System.out.println("");
        
        // Input annual income
        System.out.print("Enter your Annual Income (in INR): ");
        long income = sc.nextLong();
        
        long tax = 0;
        long taxableIncome = income;
        
        System.out.println("");
        System.out.println("=====================================");
        System.out.println("    TAX CALCULATION");
        System.out.println("=====================================");
        
        // Calculate tax based on Indian tax slabs (for individuals below 60 years)
        if (income <= 0) {
            tax = 0;
            System.out.println("Income: Rs. " + income);
            System.out.println("Tax: Rs. " + tax);
        }
        else if (income <= 250000) {
            tax = 0;
            System.out.println("Income: Rs. " + income);
            System.out.println("Tax Slab: 0%");
            System.out.println("Tax: Rs. " + tax);
        }
        else if (income <= 500000) {
            tax = (long)((income - 250000) * 0.05);
            System.out.println("Income: Rs. " + income);
            System.out.println("Tax Slab: 5% on income above Rs. 2,50,000");
            System.out.println("Taxable Amount: Rs. " + (income - 250000));
            System.out.println("Tax: Rs. " + tax);
        }
        else if (income <= 1000000) {
            tax = (long)((250000 * 0.05) + (income - 500000) * 0.2);
            System.out.println("Income: Rs. " + income);
            System.out.println("Tax Slab: 5% on Rs. 2,50,000 + 20% on income above Rs. 5,00,000");
            System.out.println("Tax: Rs. " + tax);
        }
        else {
            tax = (long)((250000 * 0.05) + (500000 * 0.2) + (income - 1000000) * 0.3);
            System.out.println("Income: Rs. " + income);
            System.out.println("Tax Slab: 5% on Rs. 2,50,000 + 20% on Rs. 5,00,000 + 30% on income above Rs. 10,00,000");
            System.out.println("Tax: Rs. " + tax);
        }
        
        // Add cess (4% health and education cess)
        long cess = (long)(tax * 0.04);
        long totalTax = tax + cess;
        
        System.out.println("");
        System.out.println("=====================================");
        System.out.println("    TAX SUMMARY");
        System.out.println("=====================================");
        System.out.println("Base Tax: Rs. " + tax);
        System.out.println("Health & Education Cess (4%): Rs. " + cess);
        System.out.println("Total Tax Payable: Rs. " + totalTax);
        
        // Calculate take-home salary (assuming monthly)
        long monthlyIncome = income / 12;
        long monthlyTax = totalTax / 12;
        long takeHomeMonthly = monthlyIncome - monthlyTax;
        
        System.out.println("");
        System.out.println("=====================================");
        System.out.println("    MONTHLY BREAKDOWN");
        System.out.println("=====================================");
        System.out.println("Monthly Income: Rs. " + monthlyIncome);
        System.out.println("Monthly Tax: Rs. " + monthlyTax);
        System.out.println("Take Home Salary (Monthly): Rs. " + takeHomeMonthly);
        
        sc.close();
    }
}
